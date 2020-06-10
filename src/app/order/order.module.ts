import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { OrderListComponent } from "./order-list.component";
import { OrderDetailGuard, OrderEditGuard } from "./order-guard.service";
import { OrderFormComponent } from "./order-form.component";
import { ProductDialogComponent } from "./product-dialog.component";

import { OrderService } from "./order.service";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material.module";
import { CustomerService } from '../customer';
import { ProductService } from '../product';
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
    OrderListComponent,
    OrderFormComponent,
    ProductDialogComponent
  ],
  providers: [
    OrderService,
    OrderDetailGuard,
    OrderEditGuard,
    CustomerService,
    ProductService
  ],
  exports: [
    OrderListComponent,
    OrderFormComponent
  ]
})
export class OrderModule { }
