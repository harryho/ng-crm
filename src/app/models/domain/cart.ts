import { Product } from './product';

/**
 * Cart - the pre-checkout shopping cart for a single user.
 *
 * Distinct from Order: a Cart is mutable, has no totals frozen yet, no
 * payment/shipment, and can be discarded. Once a Cart is converted via
 * checkout, its items become OrderItems and the Cart becomes inactive.
 */
export interface Cart {
  userId: number;
  items: CartItem[];
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  /** Snapshot of the product price at the time it was added to the cart. */
  priceAtAdd: number;
  /** Denormalized for list rendering without an extra join - see Product.brand note. */
  productName: string;
  productImageUrl: string;
}

export type { Product };