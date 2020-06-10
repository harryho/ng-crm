import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
// import {NgProgressModule, NgProgressBrowserXhr, NgProgressService } from 'ngx-progressbar';

import { OrderListComponent } from "./order-list.component";
import { OrderDetailComponent } from "./order-detail.component";
import { OrderDetailGuard, OrderEditGuard } from "./order-guard.service";
import { OrderEditComponent } from "./order-edit.component";
import { ProductDialogComponent } from "./product-dialog.component";

import { OrderService } from "./order.service";

import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material.module";

import { MatOption } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "orders", component: OrderListComponent },
      {
        path: "order/:id",
        canActivate: [OrderDetailGuard],
        component: OrderDetailComponent
      },
      {
        path: "orderEdit/:id",
        canDeactivate: [OrderEditGuard],
        component: OrderEditComponent
      }
    ])
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    OrderListComponent,
    OrderDetailComponent,
    OrderEditComponent,
    ProductDialogComponent
  ],
  providers: [OrderService, OrderDetailGuard, OrderEditGuard,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  exports: [
    OrderListComponent,
    OrderEditComponent,
    OrderDetailComponent,
    
  ],
  entryComponents: [ProductDialogComponent, MatOption]
})
export class OrderModule { }
