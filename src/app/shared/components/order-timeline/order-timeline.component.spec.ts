import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrderTimelineComponent } from './order-timeline.component';
import { OrderStatus, OrderStatusEntry, ORDER_STATUSES } from '../../../models/domain/order-status';

/**
 * OrderTimeline is a presentational component - the only logic worth
 * exercising is `stateOf(entry, idx)`, which derives a visual state
 * ("done" / "current" / "cancelled") from the entry list and the
 * current status. That drives the dot color, card background, and
 * status badge in the template.
 *
 * Inputs are signal-based (input.required), set via
 * `componentRef.setInput()` rather than mutated directly.
 */
describe('OrderTimelineComponent', () => {
  let component: OrderTimelineComponent;
  let ref: ComponentRef<OrderTimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OrderTimelineComponent] });
    const fixture = TestBed.createComponent(OrderTimelineComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
  });

  function setEntries(currentStatus: OrderStatus, entries: OrderStatusEntry[]) {
    ref.setInput('entries', entries);
    ref.setInput('currentStatus', currentStatus);
  }

  describe('stateOf(entry, idx)', () => {
    it('flags a cancelled entry as "cancelled" regardless of position', () => {
      // History: [paid, cancelled, refunded], current is "delivered" (not in history)
      setEntries('delivered', [
        { status: 'paid', at: '2025-01-01' },
        { status: 'cancelled', at: '2025-01-02' },
        { status: 'refunded', at: '2025-01-03' },
      ]);
      // The currentStatus fallback logic treats "no match" as if first
      // entry is current. So entries BEFORE that fallback land at
      // idx 0 (current) and others are "done".
      expect(component.stateOf(component.entries()[0], 0)).toBe('current');
      // But a cancelled entry overrides to cancelled.
      expect(component.stateOf(component.entries()[1], 1)).toBe('cancelled');
      expect(component.stateOf(component.entries()[2], 2)).toBe('done');
    });

    it('marks entries before current as "done" and the current one as "current"', () => {
      setEntries('shipping', [
        { status: 'pending', at: '2025-01-01' },
        { status: 'paid', at: '2025-01-02' },
        { status: 'packing', at: '2025-01-03' },
        { status: 'shipping', at: '2025-01-04' }, // idx 3, the current
      ]);
      expect(component.stateOf(component.entries()[0], 0)).toBe('done');
      expect(component.stateOf(component.entries()[1], 1)).toBe('done');
      expect(component.stateOf(component.entries()[2], 2)).toBe('done');
      expect(component.stateOf(component.entries()[3], 3)).toBe('current');
    });

    it('returns "current" for the first entry when currentStatus is not in entries', () => {
      // Defensive fallback - first entry becomes current, rest are done.
      setEntries('delivered', [
        { status: 'pending', at: '2025-01-01' },
        { status: 'paid', at: '2025-01-02' },
      ]);
      expect(component.stateOf(component.entries()[0], 0)).toBe('current');
      expect(component.stateOf(component.entries()[1], 1)).toBe('done');
    });

    it('returns "done" for entries past the current (defensive)', () => {
      // Unusual case: entries past the current. Treat as done rather
      // than breaking the visual.
      setEntries('paid', [
        { status: 'pending', at: '2025-01-01' },
        { status: 'paid', at: '2025-01-02' }, // current
        { status: 'shipping', at: '2025-01-03' },
      ]);
      expect(component.stateOf(component.entries()[2], 2)).toBe('done');
    });
  });

  describe('currentIndex computed', () => {
    it('returns the index of the most recent entry matching currentStatus', () => {
      setEntries('paid', [
        { status: 'pending', at: '2025-01-01' },
        { status: 'paid', at: '2025-01-02' },
        { status: 'packing', at: '2025-01-03' },
      ]);
      expect(component.currentIndex()).toBe(1);
    });

    it('returns -1 when currentStatus matches no entry', () => {
      setEntries('delivered', [
        { status: 'pending', at: '2025-01-01' },
        { status: 'paid', at: '2025-01-02' },
      ]);
      expect(component.currentIndex()).toBe(-1);
    });

    it('returns -1 on an empty entries list', () => {
      setEntries('pending', []);
      expect(component.currentIndex()).toBe(-1);
    });

    it('uses the LAST match (most-recent occurrence) when status repeats', () => {
      setEntries('shipping', [
        { status: 'shipping', at: '2025-01-01' },
        { status: 'cancelled', at: '2025-01-02' },
        { status: 'shipping', at: '2025-01-03' }, // current, idx 2
      ]);
      expect(component.currentIndex()).toBe(2);
    });
  });

  describe('formatStatus()', () => {
    it('titlecases a single word', () => {
      expect(component.formatStatus('pending')).toBe('Pending');
      expect(component.formatStatus('delivered')).toBe('Delivered');
    });

    it('titlecases a hyphenated multi-word status as separate words', () => {
      expect(component.formatStatus('customs-clearance')).toBe('Customs Clearance');
      expect(component.formatStatus('cancelled')).toBe('Cancelled');
    });

    it('covers every status enum value without throwing', () => {
      for (const s of ORDER_STATUSES) {
        const out = component.formatStatus(s);
        expect(out.length).toBeGreaterThan(0);
      }
    });
  });
});