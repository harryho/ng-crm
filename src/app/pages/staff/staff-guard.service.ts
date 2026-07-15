import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from '@angular/router';

import { StaffFormComponent } from './staff-form.component';

@Injectable({ providedIn: 'root' })
export class StaffDetailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = Number(route.url[1]?.path);
    if (isNaN(id) || id < 1) {
      this.router.navigate(['/staff']);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class StaffEditGuard implements CanDeactivate<StaffFormComponent> {
  canDeactivate(component: StaffFormComponent): boolean {
    if (component?.staffForm?.dirty) {
      return confirm(`Navigate away and lose all changes?`);
    }
    return true;
  }
}