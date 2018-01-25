import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
// import {NgProgressModule, NgProgressBrowserXhr, NgProgressService } from 'ngx-progressbar';

import { CustomerListComponent } from "./customer-list.component";
import { CustomerDetailComponent } from "./customer-detail.component";
import {
  CustomerDetailGuard,
  CustomerEditGuard
} from "./customer-guard.service";
import { CustomerEditComponent } from "./customer-edit.component";

import { CustomerService } from "./customer.service";
import { SharedModule } from "../shared/shared.module";

import { MaterialModule } from "../shared/material.module";
import { MatOption } from "@angular/material";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "customers", component: CustomerListComponent },
      {
        path: "customer/:id",
        canActivate: [CustomerDetailGuard],
        component: CustomerDetailComponent
      },
      {
        path: "customerEdit/:id",
        canDeactivate: [CustomerEditGuard],
        component: CustomerEditComponent
      }
    ])
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerEditComponent
  ],
  providers: [CustomerService, CustomerDetailGuard, CustomerEditGuard],
  entryComponents: [MatOption]
})
export class CustomerModule { }
