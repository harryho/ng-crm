import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BackendService } from '../../services/backend.service'
import { Observable } from 'rxjs';
import { Product } from './product';
import db from "../../services/mock.db";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = 'http://localhost:3333/products';
  private PRODUCT: string = 'PRODUCT_TOTAL_COUNT'
  private ds: Product[];
  private USE_MOCK = false
  private http = inject(HttpClient)

  useMock() {
    this.USE_MOCK = true;
  }
  useApi() {
    this.USE_MOCK = false;
  }
  constructor() {
    this.ds = db['products'] as any
  }

  reload() {
    this.ds = db['products'] as any
  }

  storeCount(count: string) {
    localStorage.setItem(this.PRODUCT, count)
  }

  async fetchDataWithFilter({ request, abortSignal }: any) {
    let list, filteredList = [];
    if (!this.USE_MOCK) {
      // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
      // indicates that the request has been aborted.
      const data = await fetch(`http://localhost:3333/products`, { signal: abortSignal });
      if (!data.ok) throw Error(`Could not fetch...`)
      list = await data.json();

    }
    else {
      list = Object.assign([], this.ds)
    }
    this.storeCount(list.length)
    filteredList = list.filter((d: Product) => {
      return !request.query ? true : (
        d.name && d.name.toLowerCase().indexOf(request.query.toLowerCase()) > -1)
    })
    console.log(filteredList)
    return filteredList
  }



  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}`);
  }




  getCount(): number {
    return localStorage.getItem(this.PRODUCT) ? Number(localStorage.getItem(this.PRODUCT)) : 100
  }

  // @ts-ignore
  async getProduct(id: string): Product {
    if (!id) {
      return {} as any
    };
    if (!this.USE_MOCK) {
      const data = await fetch(`${this.API_URL}/${id}`);

      if (!data.ok) throw Error(`Could not fetch...`)
      const product = await data.json();
      return product
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

  deleteProduct(id: string): Observable<any> {
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

  saveProduct(product: Product): Observable<Product> {
    const id = product.id
    if (!this.USE_MOCK) {
      if (id) {
        const url = `http://localhost:3333/products/${id}`;
        return this.http.put<Product>(url, product);
      }
      else {
        const id = this.getCount() + 1
        product.id = String(id)
        product.imageUri = '/assets/images/products/product-0.webp'
        const url = `http://localhost:3333/products/`;
        return this.http.post<Product>(url, product);
      }
    }
    else {
      if (id) {
        const idx = this.ds.findIndex(d => d.id = product.id)
        this.ds[idx] = Object.assign({}, product)
        return this.createObservable()
      }
      else {
        product.id = String(this.ds.length)
        this.ds[this.ds.length] = Object.assign({}, product)
        return this.createObservable()
      }
    }
  }
}
