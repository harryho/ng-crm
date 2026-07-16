import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Repository } from '../data/repository';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let repo: Repository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repo = TestBed.inject(Repository);
    repo.reset();
    service = TestBed.inject(OrderService);
  });

  it('list returns all seeded orders', async () => {
    const orders = await firstValueFrom(service.list());
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].reference).toBeTruthy();
    expect(orders[0].items.length).toBeGreaterThan(0);
  });

  it('get returns the right order by id', async () => {
    const o = await firstValueFrom(service.get(1));
    expect(o).not.toBeNull();
    expect(o!.id).toBe(1);
    expect(o!.statusHistory.length).toBeGreaterThan(0);
  });

  it('get returns null for an unknown id', async () => {
    const o = await firstValueFrom(service.get(9999));
    expect(o).toBeNull();
  });

  it('listForUser returns only that user\'s orders', async () => {
    const u1 = await firstValueFrom(service.listForUser(1));
    for (const o of u1) {
      expect(o.userId).toBe(1);
    }
    // u1, u2, ..., u14 all have at least user 1's orders in the seed (per seed.spec.ts).
    expect(u1.length).toBeGreaterThan(0);
  });

  it('listForUser returns empty for a user with no orders', async () => {
    const u = await firstValueFrom(service.listForUser(99));
    expect(u).toEqual([]);
  });

  it('save with an existing id updates that order in place (history preserved)', async () => {
    const before = await firstValueFrom(service.get(1));
    const updated = { ...before!, total: 999 };
    const saved = await firstValueFrom(service.save(updated));
    expect(saved.total).toBe(999);
    const historyLen = before!.statusHistory.length;
    const after = await firstValueFrom(service.get(1));
    expect(after!.total).toBe(999);
    expect(after!.statusHistory.length).toBe(historyLen);
  });

  it('save with id=0 creates a new order with a fresh id', async () => {
    const before = await firstValueFrom(service.list());
    const today = new Date().toISOString().slice(0, 10);
    const created = await firstValueFrom(
      service.save({
        id: 0,
        reference: 'order-test-1',
        userId: 1,
        items: [
          { productId: 0, productName: 'X', productImageUrl: 'x', quantity: 1, priceAtOrder: 10 },
        ],
        status: { status: 'pending', at: today },
        statusHistory: [{ status: 'pending', at: today }],
        payment: { method: 'card', status: 'pending', last4: null, authCode: '', paidAt: null },
        shipment: { carrierId: null, trackingNumber: null, shippedAt: null, deliveredAt: null },
        shippingAddress: { street: '1 St', city: 'C', state: '', zipcode: '00000', country: 'XX' },
        total: 10,
        orderDate: today,
        shippedDate: null,
        deliveredDate: null,
      }),
    );
    expect(created.id).toBeGreaterThan(0);
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length + 1);
  });

  it('delete removes the order', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(11));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length - 1);
    const fetched = await firstValueFrom(service.get(11));
    expect(fetched).toBeNull();
  });

  it('delete of an unknown id is a no-op', async () => {
    const before = await firstValueFrom(service.list());
    await firstValueFrom(service.delete(9999));
    const after = await firstValueFrom(service.list());
    expect(after.length).toBe(before.length);
  });

  it('appendStatus on an existing order updates current status and appends to history', async () => {
    const before = await firstValueFrom(service.get(1));
    const histBefore = before!.statusHistory.length;
    const result = await firstValueFrom(
      service.appendStatus(1, {
        status: 'cancelled',
        at: '2030-01-01',
        note: 'spec append',
      }),
    );
    expect(result).not.toBeNull();
    expect(result!.status.status).toBe('cancelled');
    expect(result!.statusHistory.length).toBe(histBefore + 1);
    expect(result!.statusHistory[result!.statusHistory.length - 1].note).toBe('spec append');
  });

  it('appendStatus on an unknown id returns null without throwing', async () => {
    const result = await firstValueFrom(
      service.appendStatus(9999, { status: 'cancelled', at: '2030-01-01' }),
    );
    expect(result).toBeNull();
  });

  it('appendStatus does not mutate other orders', async () => {
    const before1 = await firstValueFrom(service.get(1));
    const before2 = await firstValueFrom(service.get(2));
    await firstValueFrom(
      service.appendStatus(1, { status: 'cancelled', at: '2030-01-01', note: 'spec' }),
    );
    const after2 = await firstValueFrom(service.get(2));
    expect(after2!.status.status).toBe(before2!.status.status);
    expect(after2!.statusHistory.length).toBe(before2!.statusHistory.length);
    // Sanity check that order 1 actually changed.
    const after1 = await firstValueFrom(service.get(1));
    expect(after1!.status.status).not.toBe(before1!.status.status);
  });
});