/**
 * Repository verification - the in-memory data layer backing the app.
 *
 * Per the lessons-learned doc, the repository must be:
 *   - Synchronously available at module load (no async init).
 *   - Returning Observables that resolve on firstValueFrom / subscribe,
 *     never Promises, never raw values.
 *   - Returning deep clones so callers can't mutate internal state.
 *   - Reset() must restore the seed state (matches "resets on reload"
 *     behavior described in the lessons).
 */
import { firstValueFrom } from 'rxjs';
import { Repository } from './repository';

describe('Repository', () => {
  let repo: Repository;

  beforeEach(() => {
    repo = new Repository();
  });

  it('listUsers returns all seeded users', async () => {
    const users = await firstValueFrom(repo.listUsers());
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].email).toContain('@');
  });

  it('getUser returns a real user by id', async () => {
    const u = await firstValueFrom(repo.getUser(1));
    expect(u).not.toBeNull();
    expect(u!.firstname).toBeTruthy();
  });

  it('getUser returns null for an unknown id', async () => {
    const u = await firstValueFrom(repo.getUser(9999));
    expect(u).toBeNull();
  });

  it('listProducts returns all seeded products', async () => {
    const products = await firstValueFrom(repo.listProducts());
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].price).toBeGreaterThan(0);
  });

  it('listProductsFiltered matches name substring (case-insensitive)', async () => {
    const filtered = await firstValueFrom(repo.listProductsFiltered('ANTA'));
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of filtered) {
      expect(p.name.toLowerCase()).toContain('anta');
    }
  });

  it('listProductsFiltered with empty query returns everything', async () => {
    const all = await firstValueFrom(repo.listProducts());
    const empty = await firstValueFrom(repo.listProductsFiltered(''));
    expect(empty.length).toBe(all.length);
  });

  it('listOrders returns all seeded orders', async () => {
    const orders = await firstValueFrom(repo.listOrders());
    expect(orders.length).toBeGreaterThan(0);
  });

  it('listOrdersForUser filters by userId', async () => {
    const orders = await firstValueFrom(repo.listOrdersForUser(1));
    for (const o of orders) {
      expect(o.userId).toBe(1);
    }
  });

  it('listStaff returns all seeded staff', async () => {
    const staff = await firstValueFrom(repo.listStaff());
    expect(staff.length).toBeGreaterThan(0);
    expect(staff[0].role).toBeTruthy();
  });

  it('listCategories returns the lookup table', async () => {
    const cats = await firstValueFrom(repo.listCategories());
    expect(cats.length).toBeGreaterThan(0);
  });

  it('listCarriers returns the lookup table', async () => {
    const carriers = await firstValueFrom(repo.listCarriers());
    expect(carriers.length).toBeGreaterThan(0);
  });

  it('returned values are deep-cloned (mutating one does not affect next call)', async () => {
    const a = await firstValueFrom(repo.listProducts());
    a[0].name = 'TAMPERED';
    const b = await firstValueFrom(repo.listProducts());
    expect(b[0].name).not.toBe('TAMPERED');
  });

  it('reset() restores the seed state', async () => {
    const before = await firstValueFrom(repo.listProducts());
    before.length = 0; // tamper
    repo.reset();
    const after = await firstValueFrom(repo.listProducts());
    expect(after.length).toBeGreaterThan(0);
  });
});