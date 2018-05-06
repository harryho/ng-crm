import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { BackendService } from '../_services'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ICustomer } from './customer';

@Injectable()
export class CustomerService {
  private basicAction = 'customers';

  constructor(private http: Http, private backend: BackendService) { }

  getCustomers(): Observable<ICustomer[]> {
    return this.backend.getAll(this.basicAction)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCustomer(id: number): Observable<ICustomer> {
    if (id === 0) {
      return Observable.of(this.initializeCustomer());
    };
    const action = `${this.basicAction}/${id}`;
    return this.backend.getById(action)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCustomer(id: number): Observable<Response> {

    const action = `${this.basicAction}/${id}`;
    return this.backend.delete(action)
      .catch(this.handleError);
  }

  saveCustomer(customer: ICustomer): Observable<ICustomer> {


    if (customer.id === 0) {
      return this.createCustomer(customer);
    }
    return this.updateCustomer(customer);
  }

  private createCustomer(customer: ICustomer): Observable<ICustomer> {
    customer.id = undefined;
    return this.backend.create(this.basicAction, customer)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private updateCustomer(customer: ICustomer): Observable<ICustomer> {
    const action = `${this.basicAction}/${customer.id}`;
    return this.backend.update(action, customer)
      .map(() => customer)
      .catch(this.handleError);
  }

  private extractData(response: Response) {
    let body = response.json ? response.json() : response;
    return body.data ? body.data : (body || {});
  }

  private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  initializeCustomer(): ICustomer {
    // Return an initialized object
    return {
      id: 0,
      avatar: null,
      firstName: null,
      lastName: null,
      rewards: 0,
      email: null,
      membership: false,
      mobile: null
    };
  }
}
