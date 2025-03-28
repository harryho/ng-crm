import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './order';
import db from "../../services/mock.db";
import {USE_LOCAL_MOCK_DATA} from '../../config'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private API_URL = 'http://localhost:3333/orders';
  private ORDER: string = 'ORDER_TOTAL_COUNT'
  private ds: Order[];
  private USE_MOCK = USE_LOCAL_MOCK_DATA
  private http = inject(HttpClient)

  useMock() {
    this.USE_MOCK = true;
  }
  useApi() {
    this.USE_MOCK = false;
  }
  constructor() {
    this.ds = db['orders'] as any
  }

  reload() {
    this.ds = db['orders'] as any
  }

  storeCount(count: string) {
    localStorage.setItem(this.ORDER, count)
  }

  async fetchDataWithFilter({ request, abortSignal }: any) {
    let list, filteredList = [];
    if (!this.USE_MOCK) {
      // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
      // indicates that the request has been aborted.
      const data = await fetch(`http://localhost:3333/orders`, { signal: abortSignal });
      if (!data.ok) throw Error(`Could not fetch...`)
      list = await data.json();

    }
    else {
      list = Object.assign([], this.ds)
    }
    this.storeCount(list.length)
    filteredList = list.filter((d: Order) => {
      return !request.query ? true : (
        d.reference && d.reference.toLowerCase()
          .indexOf(request.query.toLowerCase()) > -1)
    })
    
    return filteredList
  }



  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}`);
  }




  getCount(): number {
    return localStorage.getItem(this.ORDER) ? Number(localStorage.getItem(this.ORDER)) : 100
  }

  // @ts-ignore
  async getOrder(id: string): Order {
    if (!id) {
      return {} as any
    };
    if (!this.USE_MOCK) {
      const data = await fetch(`${this.API_URL}/${id}`);

      if (!data.ok) throw Error(`Could not fetch...`)
      const order = await data.json();
      return order
    }
    else {
      const c = this.ds.find(d => String(d.id) == id)
      return c as any
    }

  }

  private createObservable(mock?: any): Observable<any> {
    return new Observable((subscriber) => {
      subscriber.next(mock);
      setTimeout(() => {
        subscriber.complete();
      }, 500);
    })
  }

  deleteOrder(id: string): Observable<any> {
    if (!this.USE_MOCK) {
      const url = `${this.API_URL}/${id}`;
      return this.http.delete<Response>(url);
    }
    else {
      const idx = this.ds.findIndex(d => d.id = id)
      this.ds.splice(idx, 1)
      return this.createObservable()
    }
  }

  saveOrder(order: Order): Observable<Order> {
    const id = order.id
    if (!this.USE_MOCK) {
      if (id) {
        const url = `http://localhost:3333/orders/${id}`;
        return this.http.put<Order>(url, order);
      }
      else {
        const id = this.getCount() + 1
        order.id = String(id)
        // order.avatar = '/assets/images/avatar/avatar-0.webp'
        const url = `http://localhost:3333/orders/`;
        return this.http.post<Order>(url, order);
      }
    }
    else {
      if (id) {
        const idx = this.ds.findIndex(d => d.id === order.id)
        this.ds[idx] = Object.assign({}, order)
        return this.createObservable()
      }
      else {
        order.id = String(this.ds.length)
        this.ds[this.ds.length] = Object.assign({}, order)
        return this.createObservable()
      }
    }
  }
}
