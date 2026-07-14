/**
 * User feature routes - standalone Routes file replacing the old
 * CustomerModule. Per M3 of the uplift plan, NgModules migrate to
 * standalone components and loadChildren-style routing.
 */
import { Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { UserFormComponent } from './user-form.component';
import { UserEditGuard } from './user-guard.service';

export const USER_ROUTES: Routes = [
  { path: '', component: UserListComponent },
  {
    path: 'new',
    canDeactivate: [UserEditGuard],
    component: UserFormComponent,
  },
  {
    path: 'edit/:id',
    canDeactivate: [UserEditGuard],
    component: UserFormComponent,
  },
];