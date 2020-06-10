import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthenticationService) { }

    canActivate (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) : any {
        const user = this.authService.getUser()
        if (user && user.isAuthenticated) {
            // logged in so return true 
          return  new Promise(function (resolve, _reject) {
                setTimeout(resolve, 350, true)
          })
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}