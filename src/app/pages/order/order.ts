/* Defines the order entity */
import { Customer } from "../customer";
import { Product } from "../product";

export interface Order {
  reference: string;
  amount: number;
  quantity: number;
  customerId: number;
  id: string;
  avatar: string;
  membership: boolean;
  orderDate: any;
  shippedDate: any;
  customer: Customer;
  products: Array<Product>;
  shipAddress: IAddress;
  expand?:""
}

export interface IAddress {
  address: string;
  city: string;
  country: string;
  zipcode: string;
}
