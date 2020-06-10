import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../_services'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Product, Category } from './product';

@Injectable()
export class ProductService {
  private basicAction = 'products/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getProducts(): Observable<Product[]> {
    // return this.http.get(this.baseUrl)
    const action = `${this.basicAction}?_expand=category`;
    return this.backend.getAll(action)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProduct(id: number): Observable<Product> {
    if (id === 0) {
      return Observable.of(this.initializeProduct());
    };
    const action = `${this.basicAction}${id}?_expand=category`;
    return this.backend.getByQuery(action)
      .map(this.extractData)
      // .do(data => console.log('getProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  deleteProduct(id: number): Observable<Response> {
    const action = `${this.basicAction}${id}`;
    return this.backend.delete(action)
      .catch(this.handleError);
  }

  saveProduct(product: Product): Observable<Product> {
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });

    if (product.id === 0) {
      return this.createProduct(product);
    }
    return this.updateProduct(product);
  }

  getCategories(): Observable<Category[]> {
    // return this.http.get(this.baseUrl)
    const action = 'categories/'
    return this.backend.getAll(action)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private createProduct(product: Product): Observable<Product> {
    product.id = null;
    return this.backend.create(this.basicAction, product)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private updateProduct(product: Product): Observable<Product> {
    const action = `${this.basicAction}${product.id}`;
    return this.backend.update(action, product)
      .map(() => product)
      .catch(this.handleError);
  }

  private extractData(response: Response) {
    let body : any = response.json ? response.json() : response;
    return body.data ? body.data : (body || {});
  }

  private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json() || 'Server error');
  }

  initializeProduct(): Product {
    // Return an initialized object
    return {
      id: 0,
      avatar: null,
      categoryId: 0,
      productName: null,
      unitPrice: 0,
      unitInStock: 0,
    };
  }
}
