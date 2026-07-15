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
 * Inputs are signal-based (input.required), so we set them via
 * `componentRef.setInput` rather than via the DOM.
 */
describe('OrderTimelineComponent', () => {
  let component: OrderTimelineComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OrderTimelineComponent] });
    const fixture = TestBed.createComponent(OrderTimelineComponent);
    component = fixture.componentInstance;
  });

  function makeEntry(status: OrderStatus, at = '2025-01-01'): OrderStatusEntry {
    return { status, at };
  }

  describe('stateOf(entry, idx)', () => {
    it('flags a cancelled entry as "cancelled" regardless of position', () => {
      component.currentStatus.set('pending');
      // History: [paid, cancelled, refunded], current is "pending" (not in history)
      component.entries.set([
        makeEntry('paid'),
        makeEntry('cancelled'),
        makeEntry('refunded'),
      ]);
      expect(component.stateOf(component.entries()[1], 1)).toBe('cancelled');
      expect(component.stateOf(component.entries()[0], 0)).toBe('done');
      // idx=2 is past the cancelled entry but past-index calc would otherwise
      // say "done"; the cancelled-state never gets downgraded.
      expect(component.stateOf(component.entries()[2], 2)).toBe('done');
    });

    it('marks entries before current as "done" and the current one as "current"', () => {
      component.currentStatus.set('shipping');
      component.entries.set([
        makeEntry('pending'),
        makeEntry('paid'),
        makeEntry('packing'),
        makeEntry('shipping'), // current, idx 3
      ]);
      expect(component.stateOf(component.entries()[0], 0)).toBe('done');
      expect(component.stateOf(component.entries()[1], 1)).toBe('done');
      expect(component.stateOf(component.entries()[2], 2)).toBe('done');
      expect(component.stateOf(component.entries()[3], 3)).toBe('current');
    });

    it('returns "current" for the first entry when currentStatus is not in entries', () => {
      // Defensive fallback: if we can't find the current, treat the
      // first entry as current and the rest as done so the timeline
      // doesn't look broken.
      component.currentStatus.set('delivered');
      component.entries.set([makeEntry('pending'), makeEntry('paid')]);
      expect(component.stateOf(component.entries()[0], 0)).toBe('current');
      expect(component.stateOf(component.entries()[1], 1)).toBe('done');
    });

    it('returns "done" for entries past the current (defensive)', () => {
      // Unusual case: entries past the current. Treat as done rather
      // than breaking the visual.
      component.currentStatus.set('paid');
      component.entries.set([
        makeEntry('pending'),
        makeEntry('paid'), // current
        makeEntry('shipping'), // past current
      ]);
      expect(component.stateOf(component.entries()[2], 2)).toBe('done');
    });
  });

  describe('currentIndex computed', () => {
    it('returns the index of the most recent entry matching currentStatus', () => {
      component.currentStatus.set('paid');
      component.entries.set([
        makeEntry('pending'),
        makeEntry('paid'),
        makeEntry('packing'),
      ]);
      // paid occurs at idx 1
      expect(component.currentIndex()).toBe(1);
    });

    it('returns -1 when currentStatus matches no entry', () => {
      component.currentStatus.set('delivered');
      component.entries.set([makeEntry('pending'), makeEntry('paid')]);
      expect(component.currentIndex()).toBe(-1);
    });

    it('returns -1 on an empty entries list', () => {
      component.entries.set([]);
      component.currentStatus.set('pending');
      expect(component.currentIndex()).toBe(-1);
    });

    it('uses the LAST match (most-recent occurrence) when status repeats', () => {
      component.currentStatus.set('shipping');
      component.entries.set([
        makeEntry('shipping'),
        makeEntry('cancelled'),
        makeEntry('shipping'), // current, idx 2
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
      // Sanity: every defined status should produce a non-empty label.
      for (const s of ORDER_STATUSES) {
        const out = component.formatStatus(s);
        expect(out.length).toBeGreaterThan(0);
      }
    });
  });
});