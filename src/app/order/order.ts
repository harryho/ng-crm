/* Defines the order entity */
import { ICustomer } from "../customer";
import { IProduct } from "../product";

export interface IOrder {
  reference: string;
  amount: number;
  quantity: number;
  customerId: number;
  id: number;
  avatar: string;
  membership: boolean;
  orderDate: any;
  shippedDate: any;
  customer: ICustomer;
  products: Array<IProduct>;
  shipAddress: IAddress;
}

export interface IAddress {
  address: string;
  city: string;
  country: string;
  zipcode: string;
}
