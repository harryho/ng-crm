import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Repository } from '../data/repository';
import { StaffService } from './staff.service';

describe('StaffService', () => {
  let service: StaffService;
  let repo: Repository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repo = TestBed.inject(Repository);
    repo.reset();
    service = TestBed.inject(StaffService);
  });

  it('list returns all seeded staff', async () => {
    const staff = await firstValueFrom(service.list());
    expect(staff.length).toBeGreaterThan(0);
    expect(staff[0].firstname).toBeTruthy();
    expect(staff[0].role).toBeTruthy();
  });

  it('get returns the right staff member by id', async () => {
    const s = await firstValueFrom(service.get(1));
    expect(s).not.toBeNull();
    expect(s!.id).toBe(1);
    expect(s!.firstname).toBeTruthy();
  });

  it('get returns null for an unknown id', async () => {
    const s = await firstValueFrom(service.get(9999));
    expect(s).toBeNull();
  });

  it('save with an existing id updates that staff member in place', async () => {
    const before = await firstValueFrom(service.get(1));
    const updated = { ...before!, role: 'Owner' as const };
    const saved = await firstValueFrom(service.save(updated));
    expect(saved.role).toBe('Owner');
    const after = await firstValueFrom(service.get(1));
    expect(after!.role).toBe('Owner');
  });

  it('save with id=0 creates a new staff member with a fresh id', async () => {
    const before = await firstValueFrom(service.list());
    const created = await firstValueFrom(
      service.save({
        id: 0,
        firstname: 'NewHire',
        lastname: 'NewLast',
        company: 'Test Co',
        role: 'Engineer',
        email: 'newhire@test.com',
        mobile: '555-0000',
        city: 'TestCity',
        state: 'TS',
        status: 'invited',
        isVerified: false,
        avatarUrl: 'https://i.pravatar.cc/300?img=0',
      }),
    );
    expect(created.id).toBeGreaterThan(0);
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length + 1);
  });

  it('delete removes the staff member', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(14));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length - 1);
    const fetched = await firstValueFrom(service.get(14));
    expect(fetched).toBeNull();
  });

  it('delete of an unknown id is a no-op', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(9999));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length);
  });
});