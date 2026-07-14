/**
 * OrderItem - one line on an Order.
 *
 * Per the lessons, the old `Order.itemSummary: string` field (a flat
 * free-text blob) was a known data-integrity weakness - the new model
 * holds real `OrderItem` rows that each reference a real `Product`.
 * This keeps "every order traces to a real product" checkable in seed
 * verification scripts.
 */
export interface OrderItem {
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  /** Price frozen at order time, not current product price. */
  priceAtOrder: number;
}