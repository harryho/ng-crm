/* Defines the customer entity */
export interface Customer {
  id: string;
  name: string;
  avatar: string;
  firstname: string;
  lastname: string;
  rewards: number;
  email: string;
  membership: boolean;
  mobile: string;
  phone: string;
  hasItemInShoppingCart: boolean;
}
