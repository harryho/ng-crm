import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
// import { ReactiveFormsModule } from "@angular/forms";
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
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


@NgModule({
  imports: [
    SharedModule,
    // ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: CustomerListComponent },
      // {
      //   path: ":id",
      //   canActivate: [CustomerDetailGuard],
      //   component: CustomerDetailComponent
      // }
      // ,
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
    CustomerDetailComponent,
    CustomerEditComponent
  ],
  providers: [CustomerService, CustomerDetailGuard, CustomerEditGuard,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  // entryComponents: [MatOption],
  exports: [
    CustomerListComponent,
    CustomerEditComponent,
    CustomerDetailComponent,

  ]
})
export class CustomerModule { }
