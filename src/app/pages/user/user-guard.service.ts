import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router } from '@angular/router';

import { UserFormComponent } from './user-form.component';

@Injectable({ providedIn: 'root' })
export class UserDetailGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = Number(route.url[1]?.path);
    if (!id || isNaN(id)) {
      this.router.navigate(['/user']);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class UserEditGuard implements CanDeactivate<UserFormComponent> {
  canDeactivate(component: UserFormComponent): boolean {
    if (component && component.userForm?.dirty) {
      return confirm(`Navigate away and lose all changes?`);
    }
    return true;
  }
}