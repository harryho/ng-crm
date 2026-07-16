/**
 * Order status enum + history entry.
 *
 * Status is a real enum (not free-text) so any UI that lists/groups
 * orders can rely on a known set of states. statusHistory is append-only
 * and stores every transition with a timestamp - same shape as
 * react-crm's uplift settled on.
 */
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'packing'
  | 'shipping'
  | 'customs-clearance'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusEntry {
  status: OrderStatus;
  /** ISO date string. */
  at: string;
  note?: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'paid',
  'packing',
  'shipping',
  'customs-clearance',
  'delivered',
  'cancelled',
];