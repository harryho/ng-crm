import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ProductListComponent } from "./product-list.component";
import { ProductDetailGuard, ProductEditGuard } from "./product-guard.service";
import { ProductFormComponent } from "./product-form.component";

import { ProductService } from "./product.service";
import { SharedModule } from "src/app/shared/shared.module";
import { MaterialModule } from "src/app/material.module";


@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: ProductListComponent },
      {
        path: "edit/:id",
        canDeactivate: [ProductEditGuard],
        component: ProductFormComponent
      }
    ]),
    ProductListComponent,
    ProductFormComponent
  ],
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    // ProductListComponent,
    // ProductFormComponent
  ],
  providers: [
    ProductService, ProductDetailGuard, ProductEditGuard],
  exports: [
    ProductListComponent,
    ProductFormComponent,
    RouterModule

  ]
})
export class ProductModule { }
