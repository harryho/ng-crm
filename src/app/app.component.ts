/**
 * Angular  decorators and services
 */
import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  DoCheck
} from '@angular/core';
import { AppState } from './app.service';
import { User } from './_models'
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
// import { LoginComponent} from './login';
import { RootComponent } from './root'
import { AuthenticationService } from "./_services";
/**
 * App Component
 */
@Component({
  selector: 'app',
  template: `  
   <ng-progress></ng-progress>
    <root ></root>
  `
})
export class AppComponent implements OnInit {

  isAuth: boolean;

  constructor(
    public appState: AppState,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  public ngOnInit() {
  }
}
