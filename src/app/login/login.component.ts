import {
  Component,
  EventEmitter,
  OnInit,
  Output} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AuthenticationService } from "../_services";

@Component({
  selector: "login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  @Output() isAuth = new EventEmitter<boolean>();
  model: any = {};
  isValidating = false;
  returnUrl: string;
  // isloading = true;
  // isAuthenticated = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // this.authenticationService.logout();
    this.model.username = "Admin@test.com";
    this.model.password = "password";
    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] || "loading";
      // this.isloading = false;
      // this.isAuthenticated =  false;

  }

  login() {
    this.isValidating = true;
    // this.isloading = true;
    this.authenticationService.login(this.model).subscribe(
      () => {
        // this.isAuthenticated =  true;
        console.log(" next action here ... " );
      },
      error => {
        console.log(error);
        this.isValidating = false;
      },
      ()=>{
        this.isValidating = false;
        console.log("login " + this.returnUrl);
        this.isAuth.emit(true);
        this.router.navigate([this.returnUrl]);
      }
    );
  }
}
