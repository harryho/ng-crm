import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Repository } from '../data/repository';
import { UserService } from './user.service';

/**
 * UserService and Repository are both providedIn:'root', so TestBed
 * can inject either. Each test starts with `repo.reset()` so mutations
 * from one spec don't leak into the next.
 */
describe('UserService', () => {
  let service: UserService;
  let repo: Repository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repo = TestBed.inject(Repository);
    repo.reset();
    service = TestBed.inject(UserService);
  });

  it('list returns all seeded users', async () => {
    const users = await firstValueFrom(service.list());
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].firstname).toBeTruthy();
  });

  it('get returns the right user by id', async () => {
    const u = await firstValueFrom(service.get(1));
    expect(u).not.toBeNull();
    expect(u!.id).toBe(1);
    expect(u!.firstname).toBeTruthy();
  });

  it('get returns null for an unknown id', async () => {
    const u = await firstValueFrom(service.get(9999));
    expect(u).toBeNull();
  });

  it('save with an existing id updates that user in place', async () => {
    const before = await firstValueFrom(service.get(1));
    const updated = { ...before!, firstname: 'Updated-Firstname' };
    const saved = await firstValueFrom(service.save(updated));
    expect(saved.firstname).toBe('Updated-Firstname');
    const after = await firstValueFrom(service.get(1));
    expect(after!.firstname).toBe('Updated-Firstname');
  });

  it('save with id=0 creates a new user with a fresh id', async () => {
    const before = await firstValueFrom(service.list());
    const created = await firstValueFrom(
      service.save({
        id: 0,
        firstname: 'NewFirst',
        lastname: 'NewLast',
        fullname: 'NewFirst NewLast',
        email: 'newfirst@test.com',
        mobile: '555-0001',
        phone: null,
        address: {
          street: '1 New St',
          city: 'NewCity',
          state: '',
          zipcode: '00000',
          country: 'XX',
        },
        membership: 'standard',
        rewards: 0,
        avatarUrl: 'https://i.pravatar.cc/300?img=0',
      }),
    );
    expect(created.id).toBeGreaterThan(0);
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length + 1);
    expect(after.find((u) => u.id === created.id)).toBeDefined();
  });

  it('delete removes the user', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(2));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length - 1);
    const fetched = await firstValueFrom(service.get(2));
    expect(fetched).toBeNull();
  });

  it('delete of an unknown id is a no-op', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(9999));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length);
  });

  it('filter matches by name (case-insensitive)', async () => {
    const filtered = await firstValueFrom(service.filter('BILLY'));
    expect(filtered.length).toBeGreaterThan(0);
    for (const u of filtered) {
      expect(`${u.firstname} ${u.lastname}`.toLowerCase()).toContain('billy');
    }
  });

  it('filter matches by email substring', async () => {
    const filtered = await firstValueFrom(service.filter('test.com'));
    expect(filtered.length).toBeGreaterThan(0);
    for (const u of filtered) {
      expect(u.email.toLowerCase()).toContain('test.com');
    }
  });

  it('filter with empty/whitespace query returns the whole list', async () => {
    const all = await firstValueFrom(service.list());
    const emptyFiltered = await firstValueFrom(service.filter(''));
    const wsFiltered = await firstValueFrom(service.filter('   '));
    expect(emptyFiltered.length).toBe(all.length);
    expect(wsFiltered.length).toBe(all.length);
  });
});