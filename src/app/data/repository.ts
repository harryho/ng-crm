/**
 * Repository - the in-memory data source backing the entire app.
 *
 * Per the lessons-learned doc's final verdict on react-crm's mock layer:
 *   - No HttpClient, no fetch, no Service Worker, no MSW, no
 *     angular-in-memory-web-api.
 *   - Services call this directly as plain async functions wrapped in
 *     Observables - no network layer at all.
 *   - In-memory copies of the seed arrays so mutations don't corrupt
 *     the immutable seed import.
 *
 * Scope per M2 of the uplift plan: GET-only first. M3 adds mutation
 * methods once the CRUD pages need them.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { User } from '../models/domain/user';
import { Product } from '../models/domain/product';
import { Order } from '../models/domain/order';
import { Staff } from '../models/domain/staff';
import { Category } from '../models/domain/category';
import { Carrier } from '../models/domain/carrier';
import { Address } from '../models/domain/address';
import { OrderStatusEntry } from '../models/domain/order-status';
import { Cart, CartItem } from '../models/domain/cart';

import {
  USERS,
  PRODUCTS,
  ORDERS,
  STAFF,
  CATEGORIES,
  CARRIERS,
} from './seed';

/**
 * Simulated network latency. Small enough that loading spinners don't
 * feel annoying, large enough that any code accidentally relying on
 * "the response was synchronous" breaks immediately rather than
 * masking async bugs.
 *
 * Matches the lessons: keep the "feels async" UX so consumers can't
 * accidentally depend on synchronous resolution.
 */
const SIMULATED_LATENCY_MS = 80;

/**
 * Deep clone via JSON round-trip. Seed data is plain JSON-shaped
 * (no Date objects, no Maps, no functions) so this is safe. For
 * anything fancier we'd reach for structuredClone, but plain JSON
 * keeps the bundle small and the data shape predictable.
 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

@Injectable({ providedIn: 'root' })
export class Repository {
  // Internal mutable copies. Seed imports stay untouched.
  private usersDb: User[] = clone(USERS);
  private productsDb: Product[] = clone(PRODUCTS);
  private ordersDb: Order[] = clone(ORDERS);
  private staffDb: Staff[] = clone(STAFF);

  // Lookup tables - categories and carriers don't mutate, so just clone once.
  private readonly categories: Category[] = clone(CATEGORIES);
  private readonly carriers: Carrier[] = clone(CARRIERS);

  // Carts: keyed by userId. Each user has at most one active cart;
  // checkout converts the cart to an Order and clears the slot.
  private cartsDb: Map<number, Cart> = new Map();

  // ---- Users ----

  listUsers(): Observable<User[]> {
    return of(clone(this.usersDb)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getUser(id: number): Observable<User | null> {
    const u = this.usersDb.find((x) => x.id === id) ?? null;
    return of(u ? clone(u) : null).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // ---- Products ----

  listProducts(): Observable<Product[]> {
    return of(clone(this.productsDb)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getProduct(id: number): Observable<Product | null> {
    const p = this.productsDb.find((x) => x.id === id) ?? null;
    return of(p ? clone(p) : null).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /**
   * Filtered product list, like the old `fetchDataWithFilter({ request })`.
   * Returns the whole filtered list (pagination is the caller's job).
   */
  listProductsFiltered(query: string): Observable<Product[]> {
    const q = (query ?? '').trim().toLowerCase();
    const filtered = q
      ? this.productsDb.filter((p) => p.name.toLowerCase().includes(q))
      : this.productsDb;
    return of(clone(filtered)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // ---- Orders ----

  listOrders(): Observable<Order[]> {
    return of(clone(this.ordersDb)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  listOrdersForUser(userId: number): Observable<Order[]> {
    const filtered = this.ordersDb.filter((o) => o.userId === userId);
    return of(clone(filtered)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getOrder(id: number): Observable<Order | null> {
    const o = this.ordersDb.find((x) => x.id === id) ?? null;
    return of(o ? clone(o) : null).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // ---- Staff ----

  listStaff(): Observable<Staff[]> {
    return of(clone(this.staffDb)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getStaff(id: number): Observable<Staff | null> {
    const s = this.staffDb.find((x) => x.id === id) ?? null;
    return of(s ? clone(s) : null).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // ---- Categories / Carriers (lookup data) ----

  listCategories(): Observable<Category[]> {
    return of(clone(this.categories)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  listCarriers(): Observable<Carrier[]> {
    return of(clone(this.carriers)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  getCarrier(id: number): Observable<Carrier | null> {
    const c = this.carriers.find((x) => x.id === id) ?? null;
    return of(c ? clone(c) : null).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // ---- Reset (per lessons: "resets on reload") ----

  /**
   * Restore the in-memory databases to their seed state. Useful for
   * tests and for any "reset demo data" affordance added later.
   */
  reset(): void {
    this.usersDb = clone(USERS);
    this.productsDb = clone(PRODUCTS);
    this.ordersDb = clone(ORDERS);
    this.staffDb = clone(STAFF);
  }

  // ---- Mutations (added in M3, per lessons: GET-only first, then CRUD) ----

  // Users

  saveUser(user: User): Observable<User> {
    const idx = this.usersDb.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.usersDb[idx] = clone(user);
    } else {
      // New user - assign next id.
      const nextId = Math.max(0, ...this.usersDb.map((u) => u.id)) + 1;
      this.usersDb.push({ ...clone(user), id: nextId });
    }
    return of(clone(this.usersDb[this.usersDb.findIndex((u) => u.id === user.id)])).pipe(delay(SIMULATED_LATENCY_MS));
  }

  deleteUser(id: number): Observable<void> {
    const idx = this.usersDb.findIndex((u) => u.id === id);
    if (idx >= 0) {
      this.usersDb.splice(idx, 1);
    }
    return of(undefined).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // Products

  saveProduct(product: Product): Observable<Product> {
    const idx = this.productsDb.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.productsDb[idx] = clone(product);
      return of(clone(this.productsDb[idx])).pipe(delay(SIMULATED_LATENCY_MS));
    }
    const nextId = Math.max(0, ...this.productsDb.map((p) => p.id)) + 1;
    const created: Product = { ...clone(product), id: nextId };
    this.productsDb.push(created);
    return of(clone(created)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  deleteProduct(id: number): Observable<void> {
    const idx = this.productsDb.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.productsDb.splice(idx, 1);
    }
    return of(undefined).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // Orders

  /**
   * Save an order. If `order.id` matches an existing order, update it;
   * otherwise create a new one. Per the lessons-learned scope rules,
   * manual order creation via admin form is removed in M3 - this method
   * exists for cart-checkout conversion (M4) and for status-history
   * updates (e.g. marking an order as shipped).
   */
  saveOrder(order: Order): Observable<Order> {
    const idx = this.ordersDb.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      this.ordersDb[idx] = clone(order);
      return of(clone(this.ordersDb[idx])).pipe(delay(SIMULATED_LATENCY_MS));
    }
    const nextId = Math.max(0, ...this.ordersDb.map((o) => o.id)) + 1;
    const created: Order = { ...clone(order), id: nextId };
    this.ordersDb.push(created);
    return of(clone(created)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /**
   * Append a status-history entry to an existing order and bump the
   * current status. Use this for shipment / delivery / cancellation
   * transitions; creation goes through saveOrder with full history.
   */
  appendOrderStatus(id: number, entry: Order['status']): Observable<Order | null> {
    const idx = this.ordersDb.findIndex((o) => o.id === id);
    if (idx < 0) {
      return of(null).pipe(delay(SIMULATED_LATENCY_MS));
    }
    const updated: Order = {
      ...this.ordersDb[idx],
      status: clone(entry),
      statusHistory: [...this.ordersDb[idx].statusHistory, clone(entry)],
    };
    this.ordersDb[idx] = updated;
    return of(clone(updated)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  deleteOrder(id: number): Observable<void> {
    const idx = this.ordersDb.findIndex((o) => o.id === id);
    if (idx >= 0) {
      this.ordersDb.splice(idx, 1);
    }
    return of(undefined).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // Staff

  saveStaff(member: Staff): Observable<Staff> {
    const idx = this.staffDb.findIndex((s) => s.id === member.id);
    if (idx >= 0) {
      this.staffDb[idx] = clone(member);
      return of(clone(this.staffDb[idx])).pipe(delay(SIMULATED_LATENCY_MS));
    }
    const nextId = Math.max(0, ...this.staffDb.map((s) => s.id)) + 1;
    const created: Staff = { ...clone(member), id: nextId };
    this.staffDb.push(created);
    return of(clone(created)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  deleteStaff(id: number): Observable<void> {
    const idx = this.staffDb.findIndex((s) => s.id === id);
    if (idx >= 0) {
      this.staffDb.splice(idx, 1);
    }
    return of(undefined).pipe(delay(SIMULATED_LATENCY_MS));
  }

  // ---- Carts + Checkout (M4) ----

  /**
   * Returns the user's active cart, or an empty cart if none exists.
   * Per lessons-learned scope, the cart is a per-user construct - in
   * this demo, the cart is keyed by the (currently logged-in) user's
   * id; the login page doesn't track a real session, so the cart UI
   * uses a stable default user id (see CartService).
   */
  getCart(userId: number): Observable<Cart> {
    const existing = this.cartsDb.get(userId);
    const cart: Cart = existing
      ? clone(existing)
      : { userId, items: [], updatedAt: new Date().toISOString() };
    return of(cart).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /**
   * Add a product to the user's cart. If the product is already in
   * the cart, increment its quantity rather than adding a duplicate
   * row. Returns the updated cart.
   */
  addToCart(userId: number, productId: number, quantity = 1): Observable<Cart> {
    return new Observable<Cart>((subscriber) => {
      const sub = this.getProduct(productId).subscribe((product) => {
        if (!product) {
          subscriber.next(this.emptyCart(userId));
          subscriber.complete();
          return;
        }
        const current = this.cartsDb.get(userId) ?? this.emptyCart(userId);
        const existingIdx = current.items.findIndex(
          (i) => i.productId === productId,
        );
        if (existingIdx >= 0) {
          current.items[existingIdx] = {
            ...current.items[existingIdx],
            quantity: current.items[existingIdx].quantity + quantity,
          };
        } else {
          const item: CartItem = {
            productId,
            quantity,
            priceAtAdd: product.price,
            productName: product.name,
            productImageUrl: product.imageUrl,
          };
          current.items.push(item);
        }
        current.updatedAt = new Date().toISOString();
        this.cartsDb.set(userId, current);
        subscriber.next(clone(current));
        subscriber.complete();
      });
      return () => sub.unsubscribe();
    }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  updateCartItemQuantity(
    userId: number,
    productId: number,
    quantity: number,
  ): Observable<Cart> {
    const current = this.cartsDb.get(userId) ?? this.emptyCart(userId);
    const idx = current.items.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      if (quantity <= 0) {
        current.items.splice(idx, 1);
      } else {
        current.items[idx] = { ...current.items[idx], quantity };
      }
      current.updatedAt = new Date().toISOString();
      this.cartsDb.set(userId, current);
    }
    return of(clone(current)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  removeFromCart(userId: number, productId: number): Observable<Cart> {
    return this.updateCartItemQuantity(userId, productId, 0);
  }

  clearCart(userId: number): Observable<Cart> {
    const empty = this.emptyCart(userId);
    this.cartsDb.set(userId, empty);
    return of(clone(empty)).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /**
   * Convert the user's cart to a real Order. The cart is cleared on
   * success. The Order's status starts at 'pending' (matching the
   * lessons-learned scope: "orders originate from cart/checkout
   * flow").
   */
  checkout(userId: number, shippingAddress: Address): Observable<Order | null> {
    return new Observable<Order | null>((subscriber) => {
      const cart = this.cartsDb.get(userId);
      if (!cart || cart.items.length === 0) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }
      const sub = this.getUser(userId).subscribe((user) => {
        const total = cart.items.reduce(
          (sum, i) => sum + i.priceAtAdd * i.quantity,
          0,
        );
        const today = new Date().toISOString().slice(0, 10);
        const nextId =
          Math.max(0, ...this.ordersDb.map((o) => o.id)) + 1;
        const order: Order = {
          id: nextId,
          reference: `order-${nextId}-${userId}-${cart.items.length}`,
          userId,
          items: cart.items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            productImageUrl: i.productImageUrl,
            quantity: i.quantity,
            priceAtOrder: i.priceAtAdd,
          })),
          status: { status: 'pending', at: today },
          statusHistory: [{ status: 'pending', at: today }],
          payment: {
            method: 'card',
            status: 'pending',
            last4: null,
            authCode: '',
            paidAt: null,
          },
          shipment: {
            carrierId: null,
            trackingNumber: null,
            shippedAt: null,
            deliveredAt: null,
          },
          shippingAddress,
          total,
          orderDate: today,
          shippedDate: null,
          deliveredDate: null,
        };
        this.ordersDb.push(order);
        this.cartsDb.delete(userId);
        subscriber.next(clone(order));
        subscriber.complete();
      });
      return () => sub.unsubscribe();
    }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  private emptyCart(userId: number): Cart {
    return { userId, items: [], updatedAt: new Date().toISOString() };
  }
}

// Re-export Address from this module too so consumers that only need
// the Repository don't have to dig into a second file.
export type { Address };