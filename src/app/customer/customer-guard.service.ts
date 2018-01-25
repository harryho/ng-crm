import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { CustomerEditComponent } from './customer-edit.component';

@Injectable()
export  class CustomerDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
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
export  class CustomerEditGuard implements CanDeactivate<CustomerEditComponent> {

    canDeactivate(component: CustomerEditComponent): boolean {
        if (component.customerForm.dirty) {
            let customerName = component.customerForm.get('firstName').value || 'New Customer';
            return confirm(`Navigate away and lose all changes to ${customerName}?`);
        }
        return true;
    }
}
