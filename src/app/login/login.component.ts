import {
  Component,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
  DoCheck,
  Output
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AuthenticationService } from "../_services";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "login",
  moduleId: module.id.toString(),
  templateUrl: "./login.component.html",
  styles: [
    `
    Html, body{
      height:100%;
        margin:0px;
        padding:0px;
    }

    .container {
      height:100%;
        margin: 0 auto;
        padding:0px;
        position: relative;
        top: 200px;
    }
    .grandParentContaniner{
            display:table;
            height:100%;
            margin: 0 auto;
    }
    .parentContainer{
        display:table-cell;
        vertical-align:middle;
    }
    .parentContainer .loginForm{
        padding:10px;
        background: #fff;
        border: 1px solid #ddd;
        width:400px;  /*  your login form width */    display:table-cell;
        display:table-cell;
        vertical-align:middle;

    }
    `
  ]
})
export class LoginComponent implements OnInit {
  @Output() isAuth = new EventEmitter<boolean>();
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.logout();

    this.model.username = "Admin@test.com";
    this.model.password = "password";

    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] || "/dashboard";
  }

  login() {
    this.loading = true;

    this.authenticationService.login(this.model).subscribe(
      data => {
        console.log("login " + this.returnUrl);
        this.router.navigate([this.returnUrl]);
        this.isAuth.emit(true);
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }
}
