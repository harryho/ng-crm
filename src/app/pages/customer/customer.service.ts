import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BackendService } from '../../services/backend.service'
import { Observable } from 'rxjs';
import { Customer } from './customer';
import db from "../../services/mock.db";
import { USE_LOCAL_MOCK_DATA } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private API_URL = 'http://localhost:3333/customers';
  private CUSTOMER: string = 'CUSTOMER_TOTAL_COUNT'
  private ds: Customer[];
  private USE_MOCK = USE_LOCAL_MOCK_DATA
  private http = inject(HttpClient)

  useMock() {
    this.USE_MOCK = true;
  }
  useApi() {
    this.USE_MOCK = false;
  }
  constructor() {
    this.ds = db['customers'] as any
  }

  reload() {
    this.ds = db['customers'] as any
  }

  storeCount(count: string) {
    localStorage.setItem(this.CUSTOMER, count)
  }

  async fetchDataWithFilter({ request, abortSignal }: any) {
    let list, filteredList = [];
    if (!this.USE_MOCK) {
      // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
      // indicates that the request has been aborted.
      const data = await fetch(`http://localhost:3333/customers`, { signal: abortSignal });
      if (!data.ok) throw Error(`Could not fetch...`)
      list = await data.json();

    }
    else {
      list = Object.assign([], this.ds)
    }
    this.storeCount(list.length)
    filteredList = list.filter((d: Customer) => {
      return !request.query ? true : (
        d.fullname && d.fullname.toLowerCase().indexOf(request.query.toLowerCase()) > -1)
    })
    
    return filteredList
  }



  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.API_URL}`);
  }




  getCount(): number {
    return localStorage.getItem(this.CUSTOMER) ? Number(localStorage.getItem(this.CUSTOMER)) : 100
  }

  // @ts-ignore
  async getCustomer(id: string): Customer {
    if (!id) {
      return {} as any
    };
    if (!this.USE_MOCK) {
      const data = await fetch(`${this.API_URL}/${id}`);

      if (!data.ok) throw Error(`Could not fetch...`)
      const customer = await data.json();
      return customer
    }
    else {
      const c = this.ds.find(d => String(d.id) === id)
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

  deleteCustomer(id: string): Observable<any> {
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

  saveCustomer(customer: Customer): Observable<Customer> {
    const id = customer.id
    if (!this.USE_MOCK) {
      if (id) {
        const url = `http://localhost:3333/customers/${id}`;
        return this.http.put<Customer>(url, customer);
      }
      else {
        const id = this.getCount() + 1
        customer.id = String(id)
        customer.avatar = '/assets/images/avatar/avatar-0.webp'
        const url = `http://localhost:3333/customers/`;
        return this.http.post<Customer>(url, customer);
      }
    }
    else {
      if (id) {
        const idx = this.ds.findIndex(d => d.id === customer.id)
        this.ds[idx] = Object.assign({}, customer)
        return this.createObservable()
      }
      else {
        customer.id = String(this.ds.length)
        this.ds[this.ds.length] = Object.assign({}, customer)
        return this.createObservable()
      }
    }
  }
}
