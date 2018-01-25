/* Defines the User entity */
export class User {
    id: number;
    token: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    isAuthenticated: boolean;
}