import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { OrderListComponent } from "./order-list.component";
import { OrderDetailGuard, OrderEditGuard } from "./order-guard.service";
import { OrderFormComponent } from "./order-form.component";

import { OrderService } from "./order.service";

import { CustomerService } from '../customer';
import { MaterialModule } from "src/app/material.module";
import { SharedModule } from "src/app/shared/shared.module";
@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: OrderListComponent },
      {
        path: "edit/:id",
        canDeactivate: [OrderEditGuard],
        component: OrderFormComponent
      }
    ])
  ],
  declarations: [
  ],
  providers: [
    OrderService,
    OrderDetailGuard,
    OrderEditGuard,
    CustomerService,

  ],
  exports: [

  ]
})
export class OrderModule { }
