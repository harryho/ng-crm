import { Component, OnInit, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, Event } from '@angular/router';
import { AuthenticationService } from './_services';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ngmd';
  user: any;
  isMobile: boolean;
  mode = "side"
  uiContent = "content"

  constructor(
    // private loadingBar: SlimLoadingBarService,
    private router: Router,
    public authService: AuthenticationService,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      console.log(result)
      if (result.matches) {
        // this.activateHandsetLayout();
        this.isMobile = true;
        this.mode ="over"
        this.uiContent = "mobile-content"
      }
      else{
        this.isMobile = false;
        this.mode = "side"
        this.uiContent = "content"
      }
    });
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logout(): void {
   // localStorage.removeItem('currentUser');
   this.authService.logout() 
   this.router.navigate(['login']);
  }

  isAuth(isAuth?: any) {
    if (isAuth ) {
      this.user = this.authService.getUser()
      // this.user = JSON.parse(localStorage.getItem(APP_USER_PROFILE)) || <User>{};
    }
  }

  private navigationInterceptor(event: Event): void {
  }


  ngOnDestroy() {
    this.authService.logout()
  }

}
