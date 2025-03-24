/* Defines the User entity */
export class User {
    id?: number;
    accessToken?: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    isAuthenticated?: boolean;
}