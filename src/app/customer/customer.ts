/* Defines the customer entity */
export interface ICustomer {
    id: number;
    avatar : string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    isActive: boolean;
}
