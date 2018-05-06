/* Defines the customer entity */
export interface ICustomer {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  rewards: number;
  email: string;
  membership: boolean;
  mobile: string;
}
