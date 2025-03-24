import { Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { BackendService } from '../../services/backend.service'
import { Observable } from 'rxjs';

import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private API_URL = 'http://localhost:3333/customers';
  private CUSTOMER:string = 'NG_DEOM_V3_CUSTOMER_COUNT'

  constructor(private http: HttpClient) { }

  // getResource = () => {
  //   return resource<Customer[], { query: string }>(
  //     {
  //       request: () => ({ query: this.query() }),
  //       loader: async ({ request, abortSignal }) => {
  //         // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
  //         // indicates that the request has been aborted.
  //         const data = await fetch(`http://localhost:3333/customers?firstname_like=^${request.query}`, { signal: abortSignal });
  //         console.log(data)
  //         if (!data.ok) throw Error(`Could not fetch...`)
  //         const list = await data.json();
  //         const filteredList = list.filter((d: Customer) =>
  //           !request.query ? true : (d.name.toLowerCase().indexOf(request.query.toLowerCase()) > -1))
  //         console.log(filteredList)
  //         return filteredList
  //       }
  //     });
  // }

  getCustomers(): Observable<Customer[]> {
    return     this.http.get<Customer[]>(`${this.API_URL}`);
  }

  storeCount ( count: string){
    localStorage.setItem(this.CUSTOMER, count)
  }

  
 getCount ( ): number{
    return   localStorage.getItem(this.CUSTOMER) ? Number(localStorage.getItem(this.CUSTOMER)): 100
  }

  // @ts-ignore
  getCustomer(id: string): Observable<Customer> {
    if (id) {
      return {} as any // Observable.of(this.initializeCustomer());
    };
    const url = `${this.API_URL}/${id}`;
      const obs =  this.http.get<Customer>(url);
  //    console.log(obs)
    return obs
    // const action = `${this.basicAction}${id}`;
    // return this.backend.getById(action)
    //   .map(this.extractData)
    //   .catch(this.handleError);

  }

  deleteCustomer(id: string): Observable<Response> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<Response>(url);
  }

  saveCustomer(customer: Customer): Observable<Customer> {
    const id = customer.id

    if(id){
    const url = `http://localhost:3333/customers/${id}`;
    return this.http.put<Customer>(url, customer);
    }
    else{
      const id  = this.getCount() + 1
      customer.id = String(id)
      customer.avatar = '/assets/images/avatar/avatar-0.webp'
      const url = `http://localhost:3333/customers/`;
      return this.http.post<Customer>(url, customer);
    }

    // if (customer.id === 0) {
    //   return this.createCustomer(customer);
    // }
    // return this.updateCustomer(customer);
  }

  // private createCustomer(customer: Customer): Observable<Customer> {
  //   customer.id = 0// undefined;
  //   return this.backend.create(this.basicAction, customer)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  // private updateCustomer(customer: Customer): Observable<Customer> {
  //   const action = `${this.basicAction}${customer.id}`;
  //   return this.backend.update(action, customer)
  //     .map(() => customer)
  //     .catch(this.handleError);
  // }

  // private extractData(response: Response) {
  //   let body : any = response.json ? response.json() : response;
  //   return body.data ? body.data : (body || {});
  // }

  // private handleError(error: Response): Observable<any> {
  //   // in a real world app, we may send the server to some remote logging infrastructure
  //   // instead of just logging it to the console
  //   console.error(error);
  //   return {} as any // Observable.throw(error.json() || 'Server error');
  // }

  // initializeCustomer(): Customer {
  //   // Return an initialized object
  //   return {
  //     id: 0,
  //     avatar: "",
  //     firstname: "",
  //     lastname: "",
  //     rewards: 0,
  //     email: "",
  //     membership: false,
  //     mobile:"",
  //     phone:""
  //   };
  // }
}
