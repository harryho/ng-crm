/**
 * Shipment - how the order was (or will be) delivered.
 *
 * Carries FK to Carrier plus a tracking number and the actual shipped /
 * delivered dates (nullable for orders that haven't yet shipped or
 * arrived). Per lessons-learned: shipment dates should not be fabricated
 * timestamps for orders that haven't actually shipped - null is the
 * honest value until the order has a real status transition.
 */
export interface Shipment {
  /** FK to Carrier; null until shipment actually exists (cancelled/pending orders). */
  carrierId: number | null;
  trackingNumber: string | null;
  /** ISO date; null if not yet shipped. */
  shippedAt: string | null;
  /** ISO date; null if not yet delivered. */
  deliveredAt: string | null;
}