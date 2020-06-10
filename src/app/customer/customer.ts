/* Defines the customer entity */
export interface Customer {
  id: number;
  avatar: string;
  firstname: string;
  lastname: string;
  rewards: number;
  email: string;
  membership: boolean;
  mobile: string;
  phone: string;
}
