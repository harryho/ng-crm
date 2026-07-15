/**
 * Staff feature routes - standalone Routes file replacing the old
 * ComingSoonComponent placeholder.
 */
import { Routes } from '@angular/router';
import { StaffListComponent } from './staff-list.component';
import { StaffFormComponent } from './staff-form.component';
import { StaffEditGuard } from './staff-guard.service';

export const STAFF_ROUTES: Routes = [
  { path: '', component: StaffListComponent },
  {
    path: 'new',
    canDeactivate: [StaffEditGuard],
    component: StaffFormComponent,
  },
  {
    path: 'edit/:id',
    canDeactivate: [StaffEditGuard],
    component: StaffFormComponent,
  },
];