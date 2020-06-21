import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { ProductListComponent } from "./product-list.component";
import { ProductDetailGuard, ProductEditGuard } from "./product-guard.service";
import { ProductFormComponent } from "./product-form.component";

import { ProductService } from "./product.service";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: ProductListComponent },
      {
        path: "edit/:id",
        canDeactivate: [ProductEditGuard],
        component: ProductFormComponent
      }
    ])
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    ProductListComponent,
    ProductFormComponent
  ],
  providers: [ProductService, ProductDetailGuard, ProductEditGuard],
  exports: [
    ProductListComponent,
    ProductFormComponent,
  ]
})
export class ProductModule { }
