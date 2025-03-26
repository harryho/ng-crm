import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { ProductFormComponent } from './product-form.component';

@Injectable()
export class ProductDetailGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            alert('Invalid product Id');
            // start a new navigation to redirect to list pcustomerId
            this.router.navigate(['/products']);
            // abort current navigation
            return false;
        };
        return true;
    }
}

@Injectable()
export class ProductEditGuard implements CanDeactivate<ProductFormComponent> {

    canDeactivate(component: ProductFormComponent): boolean {
        if (component.productForm.dirty) {
            // let name = component.productForm.get('name').value || 'New Product';
            return confirm(`Navigate away and lose all changes ?`);
        }
        return true;
    }
}
