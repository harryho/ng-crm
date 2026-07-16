/**
 * Product feature routes - standalone Routes file replacing the old
 * ProductModule. Per M3 of the uplift plan, NgModules migrate to
 * standalone components and loadChildren-style routing.
 */
import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { ProductFormComponent } from './product-form.component';
import { ProductEditGuard } from './product-guard.service';

export const PRODUCT_ROUTES: Routes = [
  { path: '', component: ProductListComponent },
  {
    path: 'new',
    canDeactivate: [ProductEditGuard],
    component: ProductFormComponent,
  },
  {
    path: 'edit/:id',
    canDeactivate: [ProductEditGuard],
    component: ProductFormComponent,
  },
];