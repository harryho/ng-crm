/**
 * Order feature routes - standalone Routes file replacing the old
 * OrderModule. Per M3 of the uplift plan, NgModules migrate to
 * standalone components and loadChildren-style routing.
 *
 * Per lessons-learned scope decisions, manual order creation is
 * removed - only the view (edit/:id) route exists; "new" is left in
 * for backward-compat with any old links but redirects back to list.
 */
import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list.component';
import { OrderFormComponent } from './order-form.component';
import { OrderDetailGuard } from './order-guard.service';

export const ORDER_ROUTES: Routes = [
  { path: '', component: OrderListComponent },
  {
    path: 'edit/:id',
    canActivate: [OrderDetailGuard],
    component: OrderFormComponent,
  },
];