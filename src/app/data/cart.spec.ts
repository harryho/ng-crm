/**
 * Cart + Checkout verification - covers the M4 cart-to-order conversion
 * path. Per the lessons-learned scope, "orders originate from cart/checkout
 * flow" - so this is the canonical way an Order gets created, and a
 * regression here means no orders get made.
 */
import { firstValueFrom } from 'rxjs';
import { Repository } from './repository';

describe('Cart + Checkout flow', () => {
  let repo: Repository;

  beforeEach(() => {
    repo = new Repository();
  });

  it('starts with an empty cart for a fresh user', async () => {
    const cart = await firstValueFrom(repo.getCart(1));
    expect(cart.items).toEqual([]);
    expect(cart.userId).toBe(1);
  });

  it('addToCart adds a new line item with the snapshot price', async () => {
    const cart = await firstValueFrom(repo.addToCart(1, 0, 2));
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].productId).toBe(0);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.items[0].priceAtAdd).toBeGreaterThan(0);
    expect(cart.items[0].productName).toBeTruthy();
  });

  it('addToCart increments quantity when the product is already in cart', async () => {
    await firstValueFrom(repo.addToCart(1, 0, 1));
    const cart = await firstValueFrom(repo.addToCart(1, 0, 2));
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it('updateCartItemQuantity with 0 removes the line', async () => {
    await firstValueFrom(repo.addToCart(1, 0, 1));
    const cart = await firstValueFrom(repo.updateCartItemQuantity(1, 0, 0));
    expect(cart.items).toEqual([]);
  });

  it('checkout creates an Order, clears the cart, returns the new Order', async () => {
    await firstValueFrom(repo.addToCart(1, 0, 2));
    await firstValueFrom(repo.addToCart(1, 3, 1));
    const user = await firstValueFrom(repo.getUser(1));
    const order = await firstValueFrom(repo.checkout(1, user!.address));
    expect(order).not.toBeNull();
    expect(order!.items.length).toBe(2);
    expect(order!.status.status).toBe('pending');
    expect(order!.total).toBeGreaterThan(0);
    expect(order!.userId).toBe(1);

    // Cart is now empty after checkout
    const cart = await firstValueFrom(repo.getCart(1));
    expect(cart.items).toEqual([]);
  });

  it('checkout on an empty cart returns null', async () => {
    const user = await firstValueFrom(repo.getUser(1));
    const order = await firstValueFrom(repo.checkout(1, user!.address));
    expect(order).toBeNull();
  });

  it('checkout preserves line-item productName / productImageUrl from cart snapshot', async () => {
    await firstValueFrom(repo.addToCart(1, 5, 1));
    const user = await firstValueFrom(repo.getUser(1));
    const order = await firstValueFrom(repo.checkout(1, user!.address));
    expect(order!.items[0].productId).toBe(5);
    expect(order!.items[0].productName).toBeTruthy();
    expect(order!.items[0].productImageUrl).toMatch(/^https?:\/\//);
  });
});