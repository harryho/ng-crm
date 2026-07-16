/**
 * Payment - how the order was paid.
 *
 * Kept as a small structured record so it can be displayed (status,
 * method, last4) without joining a separate payments table.
 */
export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  /** Last 4 digits of the card, or null for non-card methods. */
  last4: string | null;
  /** Authorization id from the (fake) payment processor. */
  authCode: string;
  paidAt: string | null;
}

export type PaymentMethod = 'card' | 'paypal' | 'bank-transfer';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';