import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';



import { IOrder, IAddress } from './order';
import { Product } from '../product';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

@Injectable()
export class OrderService {
  private basicAction = 'orders/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getOrders(): Observable<IOrder[]> {
    // return this.http.get(this.basicAction)
    const action = `${this.basicAction}?_expand=customer`;
    return this.backend.getAll(action)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getOrder(id: number): Observable<IOrder> {
    // if (id === 0) {
    //   return Observable.of(this.initializeOrder());
    // };
    const action = `${this.basicAction}${id}?_expand=customer`;
    return this.backend.getById(action)
      .map(this.extractData)
      // .do(data => console.log('getOrder: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  deleteOrder(id: number): Observable<Response> {
    const action = `${this.basicAction}${id}`;
    return this.backend.delete(action)
      .catch(this.handleError);
  }

  saveOrder(order: IOrder): Observable<IOrder> {
    if (order.id) {
      return this.createOrder(order);
    }
    return this.updateOrder(order);
  }

  private createOrder(order: IOrder): Observable<IOrder> {
    order.id = ""
    return this.backend.create(this.basicAction, order)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private updateOrder(order: IOrder): Observable<IOrder> {
    const action = `${this.basicAction}${order.id}`;
    return this.backend.update(action, order)
      .map(() => order)
      .catch(this.handleError);
  }

  private extractData(response: Response) {
    const body : any = response.json ? response.json() : response;
    return body.data ? body.data : (body || {});
  }

  private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return {} as any //Observable.throw(error.json() || 'Server error');
  }

  // initializeOrder(): IOrder {
  //   // Return an initialized object
  //   return {
  //     id: 0,
  //     avatar: null,
  //     reference: null,
  //     amount: 0,
  //     products: Array<Product>(),
  //     orderDate: null,
  //     shippedDate: null,
  //     shipAddress: <IAddress>{},
  //     customerId: 0,
  //     quantity: 0,
  //     membership: false,
  //     customer: null,
  //   };
  // }
}
