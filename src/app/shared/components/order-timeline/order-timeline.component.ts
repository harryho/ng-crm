import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { OrderStatus, OrderStatusEntry } from '../../../models/domain/order-status';

/**
 * OrderTimeline - vertical timeline of an Order's status history.
 *
 * Visual states per entry:
 *   - 'cancelled' (red):    the order was cancelled at this step
 *   - 'done'     (green):   a past step the order successfully passed through
 *   - 'current'  (primary): the active step the order is currently in
 *
 * Each entry shows: status icon in a colored dot, status name, the
 * timestamp, and an optional note.
 */
@Component({
  selector: 'app-order-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './order-timeline.component.html',
  styleUrls: ['./order-timeline.component.css'],
})
export class OrderTimelineComponent {
  /** All history entries (oldest first). */
  entries = input.required<OrderStatusEntry[]>();
  /** The current (most recent) status. */
  currentStatus = input.required<OrderStatus>();
  /** When the current entry was reached, used to decide current/done. */
  currentAt = input<string>('');

  readonly stateIcons: Record<OrderStatus, string> = {
    pending: 'hourglass_top',
    paid: 'credit_card',
    packing: 'inventory_2',
    shipping: 'local_shipping',
    'customs-clearance': 'gavel',
    delivered: 'check_circle',
    cancelled: 'cancel',
  };

  /** Index of the current entry in the list, or -1 if not present. */
  readonly currentIndex = computed(() => {
    const list = this.entries();
    if (!list.length) return -1;
    // The current entry is the most recent one whose status matches currentStatus.
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].status === this.currentStatus()) return i;
    }
    return -1;
  });

  stateOf(entry: OrderStatusEntry, idx: number): 'cancelled' | 'done' | 'current' {
    if (entry.status === 'cancelled') return 'cancelled';
    const cur = this.currentIndex();
    if (cur < 0) return idx === 0 ? 'current' : 'done';
    if (idx < cur) return 'done';
    if (idx === cur) return 'current';
    // idx > cur: a future step that hasn't happened yet (shouldn't occur
    // in well-formed data, but render as 'done' so it doesn't look broken)
    return 'done';
  }

  formatStatus(status: OrderStatus): string {
    return status
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  }
}