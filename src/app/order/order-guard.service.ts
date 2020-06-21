import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  CanDeactivate
} from "@angular/router";
import { OrderFormComponent } from "./order-form.component";

@Injectable()
export class OrderDetailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let id = +route.url[1].path;
    if (isNaN(id) || id < 1) {
      alert("Invalid order Id");
      // start a new navigation to redirect to list pcustomerId
      this.router.navigate(["/orders"]);
      // abort current navigation
      return false;
    }
    return true;
  }
}

@Injectable()
export class OrderEditGuard implements CanDeactivate<OrderFormComponent> {
  canDeactivate(component: OrderFormComponent): boolean {
    if (component.orderForm.dirty) {
      let orderName = component.orderForm.get("reference").value || "New Order";
      return confirm(`Navigate away and lose all changes to ${orderName}?`);
    }
    return true;
  }
}
