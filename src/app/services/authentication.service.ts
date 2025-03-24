import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models'
import { BackendService } from './backend.service'


const APP_USER_PROFILE = "NG_CRM_USER_2.0"
@Injectable()
export class AuthenticationService {
   API_URL = "http://localhost:3333/token"

  constructor(private http: HttpClient, private backend: BackendService) { }

  async login(user: any) {
    // return this.backend.login('token', user)
    //   .map((response: Response) => {
    //     // login successful if there's a token in the response
    //     let data = (<any>response);
    //     let user = <User>data.user;
    //     if (user && data.access_token) {
    //       // store user details and token in local storage to keep user logged in between page refreshes
    //       user.token = data.access_token;
    //       user.isAuthenticated = true;
    //       localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
    //     }
    //   });
    const data: any = await this.http.get<User>(this.API_URL)

    user.token = data ? data?.accessToken : "access_token";
    user.isAuthenticated = true;
    localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
    return new Promise(function (resolve, _reject) {
      setTimeout(resolve, 300, true)
})
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(APP_USER_PROFILE);
    return new Promise(function (resolve, _reject) {
      setTimeout(resolve, 300, true)
})
  }

  isAuthenticated() {
    let user = this.getUser() // <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    return user && user.isAuthenticated ? true : false;
  }

  getUser() {
    let user = <User>JSON.parse(
      localStorage.getItem(APP_USER_PROFILE) as string);
    return user;
  }

}
