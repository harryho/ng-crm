import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomerListComponent } from "./customer-list.component";
import {
  CustomerDetailGuard,
  CustomerEditGuard
} from "./customer-guard.service";
import { CustomerEditComponent } from "./customer-edit.component";

import { CustomerService } from "./customer.service";
import { SharedModule } from "../shared/shared.module";

import { MaterialModule } from "../shared/material.module";


@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: CustomerListComponent },
      {
        path: "new/",
        canDeactivate: [CustomerEditGuard],
        component: CustomerEditComponent
      },
      {
        path: "edit/:id",
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
    CustomerEditComponent
  ],
  providers: [CustomerService, CustomerDetailGuard, CustomerEditGuard,
  ],
  // entryComponents: [MatOption],
  exports: [
    CustomerListComponent,
    CustomerEditComponent,

  ]
})
export class CustomerModule { }
