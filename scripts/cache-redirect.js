#!/usr/bin/env node
/**
 * cache-redirect.js
 *
 * Ensures `.angular/cache` is a symlink to a directory on the host's
 * NATIVE filesystem (e.g. /tmp/ on Linux, the user-temp dir on macOS/
 * Windows) rather than on /mnt/c/ (the WSL DrvFS mount).
 *
 * Why this exists
 * --------------
 * Vite's dep optimizer ends each prebundling cycle with an atomic
 * `renameSync(tempDir, finalDir)` to publish its cache. WSL's DrvFS
 * 9P mount intermittently rejects that specific `rename()` syscall
 * with `EACCES` even when `ls -la` shows full write permissions, which
 * Vite surfaces as:
 *
 *     [vite] (client) error while updating dependencies:
 *     Error: EACCES: permission denied, rename
 *     '.../vite/deps_temp_xxx' -> '.../vite/deps'
 *
 * Clearing the cache once lets Vite try again from scratch, so
 * `rm -rf .angular/cache` is a workaround - but it returns the next
 * time Angular CLI recreates the directory on /mnt/c/. Pointing
 * `.angular/cache` at a native-FS path sidesteps the DrvFS rename
 * bug entirely.
 *
 * Idempotent. Safe to run before every `npm start` (which is what
 * the `prestart`/`predev` hooks do). Also cross-platform: the same
 * script works on Linux (incl. WSL), macOS, and Windows since it
 * uses Node's portable `os.tmpdir()`.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CACHE_LINK = path.join(PROJECT_ROOT, '.angular', 'cache');

// Stable per-project tmpdir name (different repos on the same host
// shouldn't share cache state).
const PROJECT_HASH = crypto
  .createHash('sha1')
  .update(PROJECT_ROOT)
  .digest('hex')
  .slice(0, 10);
const CACHE_TARGET = path.join(os.tmpdir(), `ng-crm-cache-${PROJECT_HASH}`);

function log(msg) {
  console.log(`[cache-redirect] ${msg}`);
}

// Ensure the target dir exists.
try {
  fs.mkdirSync(CACHE_TARGET, { recursive: true });
} catch (e) {
  log(`could not create ${CACHE_TARGET}: ${e.message}`);
  process.exit(1);
}

// Decide whether the current `.angular/cache` already points at our
// target. Symlink + correct target = no work.
let needRedirect = true;
try {
  const lst = fs.lstatSync(CACHE_LINK);
  if (lst.isSymbolicLink()) {
    const target = fs.realpathSync(CACHE_LINK);
    if (target === CACHE_TARGET) {
      log(`OK: ${CACHE_LINK} -> ${CACHE_TARGET}`);
      needRedirect = false;
    } else {
      log(`existing symlink points elsewhere (${target}); resetting`);
    }
  } else {
    log(`existing entry is a real ${lst.isDirectory() ? 'directory' : 'file'}; replacing with symlink`);
  }
} catch (e) {
  if (e.code === 'ENOENT') {
    log(`no existing entry; creating symlink`);
  } else {
    log(`stat failed: ${e.message}`);
    process.exit(1);
  }
}

if (needRedirect) {
  // rmSync handles both real-dir and broken-symlink cases.
  try {
    fs.rmSync(CACHE_LINK, { recursive: true, force: true });
  } catch (e) {
    log(`could not remove ${CACHE_LINK}: ${e.message}`);
    process.exit(1);
  }
  try {
    fs.symlinkSync(CACHE_TARGET, CACHE_LINK, 'dir');
  } catch (e) {
    log(`symlink failed: ${e.message}`);
    process.exit(1);
  }
  log(`created symlink ${CACHE_LINK} -> ${CACHE_TARGET}`);
}
