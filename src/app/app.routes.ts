import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/notfound';
import { AuthGuard } from './auth.guard.service';
import { LoadingComponent } from './pages/loading';
import { ComingSoonComponent } from './pages/comingsoon/comingsoon.component';

export const routes: Routes = [
  {
    path: "loading",
    component: LoadingComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent
    , canActivate: [AuthGuard],
  },
  {
    path: 'ui-components',
    loadChildren: () =>
      import('./pages/ui-components/ui-components.routes').then(
        (m) => m.UiComponentsRoutes
      ),
  },
  {
    path: "customer",
    loadChildren: () =>
      import('./pages/customer/customer.module').then(m => m.CustomerModule)
    , canActivate: [AuthGuard]
  },
  {
    path: "product",
    loadChildren: () =>
      import('./pages/product/product.module').then(m => m.ProductModule)
    , canActivate: [AuthGuard]
  },
  {
    path: "order",
    loadChildren: () =>
      import('./pages/order/order.module').then(m => m.OrderModule)
    , canActivate: [AuthGuard]
  },
  {
    path: "blog",
    component: ComingSoonComponent
    , canActivate: [AuthGuard]
  },
  {
    path: "staff",
    component: ComingSoonComponent
    , canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/authentication.routes').then(
        (m) => m.AuthenticationRoutes
      ),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: "**",
    component: NotFoundComponent

  }

];

