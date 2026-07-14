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
}

// Re-export Address from this module too so consumers that only need
// the Repository don't have to dig into a second file.
export type { Address };