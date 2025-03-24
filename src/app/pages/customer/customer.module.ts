import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomerListComponent } from "./customer-list.component";
import {
  CustomerDetailGuard,
  CustomerEditGuard
} from "./customer-guard.service";
import { CustomerFormComponent } from "./customer-form.component";

import { CustomerService } from "./customer.service";
import { SharedModule } from "../../shared/shared.module";

import { MaterialModule } from "../../material.module";


@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: "",
        component: CustomerListComponent
      },
      {
        path: "new",
        canDeactivate: [CustomerEditGuard],
        component: CustomerFormComponent
      },
      {
        path: "edit/:id",
        canDeactivate: [CustomerEditGuard],
        component: CustomerFormComponent
      }
    ]),
    CustomerListComponent,
    CustomerFormComponent,
// AppRoutingModule
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */

  ],
  providers: [
    CustomerService,
     CustomerDetailGuard, CustomerEditGuard,
  ],
  // entryComponents: [MatOption],
  exports: [
    CustomerListComponent,
    CustomerFormComponent,
    RouterModule

  ]
})
export class CustomerModule { }
