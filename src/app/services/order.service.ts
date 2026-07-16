/**
 * OrderService - thin wrapper over Repository for Order domain operations.
 *
 * Replaces the old OrderService (which talked to HttpClient + a mock
 * backend). Per the lessons-learned doc's final verdict, no HttpClient
 * is involved - this service is a pure pass-through to Repository.
 *
 * Per the lessons-learned scope rules, manual "create order from scratch"
 * via admin form is not exposed; orders are created via cart checkout
 * (M4) and updated via status transitions (appendStatus).
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../data/repository';
import { Order } from '../models/domain/order';
import { OrderStatusEntry } from '../models/domain/order-status';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly repo = inject(Repository);

  list(): Observable<Order[]> {
    return this.repo.listOrders();
  }

  listForUser(userId: number): Observable<Order[]> {
    return this.repo.listOrdersForUser(userId);
  }

  get(id: number): Observable<Order | null> {
    return this.repo.getOrder(id);
  }

  save(order: Order): Observable<Order> {
    return this.repo.saveOrder(order);
  }

  appendStatus(id: number, entry: OrderStatusEntry): Observable<Order | null> {
    return this.repo.appendOrderStatus(id, entry);
  }

  delete(id: number): Observable<void> {
    return this.repo.deleteOrder(id);
  }
}