/* Defines the order entity */
import { Customer } from "../customer";
import { Product } from "../product";

export interface Order {
  reference: string;
  amount: number;
  // quantity: number;

  id: string;
  // avatar: string;
  membership: boolean;
  orderDate: any;
  shippedDate: any;
  customer: string;
  products: Array<Product>;
  shipAddress: IAddress;
  delivery: string;
  expand?:"";
  lineItems: Product[];
}

export interface IAddress {
  street: string;
  city: string;
  country: string;
  zipcode: string;
}
