/**
 * Cart feature routes - standalone Routes file replacing the old
 * NgModule pattern.
 */
import { Routes } from '@angular/router';
import { CartListComponent } from './cart-list.component';

export const CART_ROUTES: Routes = [
  { path: '', component: CartListComponent },
];