import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  [x: string]: any;
  title = 'ngmd';
  user: any;

  isAuth(isAuth?: any) {
    if (isAuth ) {
      this.user = this.authService.getUser()
      // this.user = JSON.parse(localStorage.getItem(APP_USER_PROFILE)) || <User>{};
    }
  }

}
