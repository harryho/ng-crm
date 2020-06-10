import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { AboutComponent } from './about';
import { AuthGuard } from './_guard';
import { NotFoundPageComponent } from './notfoundpage';
import { LoginComponent } from './login';
import { LoadingComponent } from './loading';


// const routes: Routes = [];

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
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
    path: "about",
    component: AboutComponent
    , canActivate: [AuthGuard]
  },
  {
    path: "customers",
    loadChildren: () =>
    import('./customer/customer.module').then(m => m.CustomerModule)
    , canActivate: [AuthGuard]
  },
  {
    path: "orders",
    loadChildren: () =>
    import('./order/order.module').then(m => m.OrderModule)
    , canActivate: [AuthGuard]
  },
  {
    path: "products",
    loadChildren: () =>
    import('./product/product.module').then(m => m.ProductModule)
    , canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: "**",
    component: NotFoundPageComponent
  },
  // ]
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
