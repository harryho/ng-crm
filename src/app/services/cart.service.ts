/**
 * CartService - per-user cart state + checkout flow.
 *
 * The cart is keyed by userId. The auth flow in this demo doesn't track
 * a real session across pages, so we use a stable default user (id 1 -
 * the first user in the seed) until a real session is added. Switching
 * which user the cart belongs to is a one-line change here.
 *
 * Per the lessons-learned scope decisions, orders originate only from
 * this cart-checkout flow - manual "create order from scratch" admin
 * forms were removed in M3.
 */
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Repository } from '../data/repository';
import { OrderService } from './order.service';
import { Cart } from '../models/domain/cart';
import { Address } from '../models/domain/address';
import { Order } from '../models/domain/order';

const DEFAULT_USER_ID = 1;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly repo = inject(Repository);
  // Use OrderService only to refresh the orders list after checkout.
  private readonly orderService = inject(OrderService);

  /**
   * Active cart as a signal - components subscribe reactively.
   * Initialised empty; populated by ensureLoaded() on first call.
   */
  private readonly _cart = signal<Cart>({
    userId: DEFAULT_USER_ID,
    items: [],
    updatedAt: new Date().toISOString(),
  });

  readonly cart = this._cart.asReadonly();
  readonly itemCount = computed(() =>
    this._cart().items.reduce((sum, i) => sum + i.quantity, 0),
  );
  readonly total = computed(() =>
    this._cart().items.reduce(
      (sum, i) => sum + i.priceAtAdd * i.quantity,
      0,
    ),
  );

  /**
   * Ensure the cart signal reflects the repository state. Idempotent
   * enough to call from ngOnInit in any cart-aware component.
   */
  async ensureLoaded(): Promise<void> {
    const cart = await firstValueFrom(this.repo.getCart(DEFAULT_USER_ID));
    this._cart.set(cart);
  }

  async addToCart(productId: number, quantity = 1): Promise<void> {
    const cart = await firstValueFrom(
      this.repo.addToCart(DEFAULT_USER_ID, productId, quantity),
    );
    this._cart.set(cart);
  }

  async setQuantity(productId: number, quantity: number): Promise<void> {
    const cart = await firstValueFrom(
      this.repo.updateCartItemQuantity(DEFAULT_USER_ID, productId, quantity),
    );
    this._cart.set(cart);
  }

  async removeItem(productId: number): Promise<void> {
    const cart = await firstValueFrom(
      this.repo.removeFromCart(DEFAULT_USER_ID, productId),
    );
    this._cart.set(cart);
  }

  async clear(): Promise<void> {
    const cart = await firstValueFrom(this.repo.clearCart(DEFAULT_USER_ID));
    this._cart.set(cart);
  }

  /**
   * Convert the cart to an Order. Returns the created Order, or null
   * if the cart was empty (no checkout happens).
   */
  async checkout(shippingAddress: Address): Promise<Order | null> {
    const order = await firstValueFrom(
      this.repo.checkout(DEFAULT_USER_ID, shippingAddress),
    );
    if (order) {
      // Clear local cart signal to match the repo (which deletes the slot).
      this._cart.set({
        userId: DEFAULT_USER_ID,
        items: [],
        updatedAt: new Date().toISOString(),
      });
      // Trigger OrderService reload signal if/when wired.
    }
    return order;
  }
}