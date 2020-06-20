import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient,  } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { User } from '../_models';
import db from "./demo.db";
// import { AuthenticationService } from '.';


@Injectable()
export class BackendService {

  private baseUrl: string = "http://localhost:5354/";
  ds: any;

  constructor(private http: HttpClient, 
    private location: Location) {
    // console.log(http);
    // this.location.prepareExternalUrl(this.baseUrl);
    this.ds = Object.assign({}, db) || {}
    console.log(this.ds)
  }

  getModel(action) {
    if (action.includes('?') && action.includes('/')) {
      return action.indexOf('?') > action.indexOf('/') ? action.substring(0, action.indexOf('/')) : action.substring(0, action.indexOf('?'))
    } else {
      return action.includes('?') ? action.substring(0, action.indexOf('?')) : action.substring(0, action.indexOf('/'))
    }
  }

  getId(action, model) {
    action = action.substr(model.length + 1)
    return action.length > 0 && (action.includes('?') ? action.substring(0, action.indexOf('?')) : action)
  }

  getExpand(action, model) {
    action = action.substr(action.indexOf('?'))
    return action.includes('_expand') ? (
      action.includes('&') ?
        action.substring('_expand='.length + 1, action.indexOf('&')) :
        action.substring('_expand='.length + 1)) : undefined
  }

  getEmbed(action) {
    return action.includes('?') ? action.substring(action.indexOf('/'), action.indexOf('?')) : action.substring(action.indexOf('/'))
  }

  getData(action: string) {
    const self = this
    return new Promise(function (resolve, reject) {
      const model = self.getModel(action)
      const idStr = self.getId(action, model)
      const id = isNaN(idStr) ? undefined : parseInt(idStr)
      let exp = self.getExpand(action, model)
      const expandModel = exp ? exp === "category" ? "categories" : exp + "s" : exp
      const embed = self.getEmbed(action)
      console.log(model)
      let result
      let expand, expandId
      console.log(expandModel)
      if (model in self.ds) {
        if (id) {
          result = self.ds[model][self.ds[model].findIndex(d => d.id === id)]

          if (expandModel) {
            expand = expandModel === "categories" ? "category" : expandModel.substr(0, expandModel.length - 1)
            expandId = result[expand + "Id"]
            result[expand] = self.ds[expandModel][self.ds[expandModel].findIndex(d => d.id === expandId)]
          }
        } else {
          result = self.ds[model].map(m => {
            if (expandModel) {
              expand = expandModel === "categories" ? "category" : expandModel.substr(0, expandModel.length - 1)
              expandId = m[expand + "Id"]
              m[expand] = self.ds[expandModel][self.ds[expandModel].findIndex(d => d.id === expandId)]
            }
            return m
          })
        }
      }
      setTimeout(resolve, 200, { data: result })
    });
  }


  getAll(action: string) {
    return Observable.fromPromise(this.getData(action))
  }

  getByQuery(action: string) {
    return Observable.fromPromise(this.getData(action))
  }

  getById(action: string) {
    // const url = `${this.baseUrl}${action}`
    // return this.http.get(url, this.jwt()).map((response: Response) => response.json());
    return Observable.fromPromise(this.getData(action))
  }

  create(action: string, data: any) {
    return Observable.fromPromise(new Promise(function (resolve, reject) {
      const model = this.getModel(action)
      data.id = this.ds[model] + 1
      this.ds[model].push(data)
      setTimeout(resolve, 200, { data: data })
    }))
  }

  update(action: string, data: any) {
    return Observable.fromPromise(new Promise(function (resolve, reject) {
      const model = this.getModel(action)
      const idx = this.ds[model].findIndex(d => d.id === data.id)
      this.ds[model][idx] = Object.assign({}, data)
      setTimeout(resolve, 200, { data: data })
    }))

  }

  delete(action: string) {
    return Observable.fromPromise(new Promise(function (resolve, reject) {
      const model = this.getModel(action)
      const id = this.getId()
      id && this.ds[model].splice(this.ds[model].findIndex(d => d.id === id))
      setTimeout(resolve, 200, { status: 200 })
    }))
  }

  login(action: string, user: User) {
    const self = this;
    console.log(this.ds)
    return Observable.fromPromise(new Promise(function (resolve, reject) {
      const { access_token, user } = self.ds.token
      setTimeout(resolve, 200, {
        // data: {
        access_token,
        user
        // }
      })
    }));
  }

  // private helper methods
  // private form() {
  //   let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  //   return { headers: headers };
  // }

  // private jwt() {
  //   // create authorization header with jwt token
  //   let user =  this.authService.getUser() //JSON.parse( );
  //   if (user && user.token) {
  //     let headers = new Headers({ 'Authorization': 'Bearer ' + user.token });
  //     return { headers: headers } ;
  //   }
  // }

  // private handleError(error: Response) {
  //   console.error(error);
  //   return Observable.throw(error.json() || 'Server error');
  // }
}
