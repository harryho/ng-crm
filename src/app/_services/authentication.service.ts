import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {User} from '../_models'
import {BackendService} from './backend.service'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private backend: BackendService) { }

    login(user: any) {
        return this.backend.login('token', user)
            .map((response: Response) => {
                // login successful if there's a token in the response
                let data = (<any>response);
                let user = <User>data.user;
                if (user && data.access_token) {
                    // store user details and token in local storage to keep user logged in between page refreshes
                    user.token = data.access_token;
                    user.isAuthenticated = true;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    isAuthenticated ( ){
        let user = <User>JSON.parse(localStorage.getItem('currentUser'));
        return user&& user.isAuthenticated? true :false;
    }
}