import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from '@angular/router';

import { ProductFormComponent } from './product-form.component';

@Injectable({ providedIn: 'root' })
export class ProductDetailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = Number(route.url[1]?.path);
    if (isNaN(id) || id < 1) {
      this.router.navigate(['/product']);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class ProductEditGuard implements CanDeactivate<ProductFormComponent> {
  canDeactivate(component: ProductFormComponent): boolean {
    if (component?.productForm?.dirty) {
      return confirm(`Navigate away and lose all changes?`);
    }
    return true;
  }
}