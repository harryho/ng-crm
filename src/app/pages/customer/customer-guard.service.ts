import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { CustomerFormComponent } from './customer-form.component';

@Injectable()
export  class CustomerDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        debugger
        if (!id) {
            alert('Invalid customer Id');
            // start a new navigation to redirect to list page
            this.router.navigate(['/customers']);
            // abort current navigation
            return false;
        };
        return true;
    }
}

@Injectable()
export  class CustomerEditGuard implements CanDeactivate<CustomerFormComponent> {

    canDeactivate(component: CustomerFormComponent): boolean {
        if (component && component.customerForm.dirty) {
            // let customerName = component ? component.customerForm.get('firstname').value || 'New Customer';
            return confirm(`Navigate away and lose all changes?`);
        }
        return true;
    }
}
