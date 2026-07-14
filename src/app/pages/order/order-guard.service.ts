import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from '@angular/router';

import { OrderFormComponent } from './order-form.component';

@Injectable({ providedIn: 'root' })
export class OrderDetailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = Number(route.url[1]?.path);
    if (isNaN(id) || id < 1) {
      this.router.navigate(['/order']);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class OrderEditGuard implements CanDeactivate<OrderFormComponent> {
  canDeactivate(component: OrderFormComponent): boolean {
    if (!component) return true;
    return true;
  }
}