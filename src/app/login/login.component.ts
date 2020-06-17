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

@Component({
  selector: "login-form",
  // moduleId: module.id.toString(),
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
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
      this.route.snapshot.queryParams["returnUrl"] || "dashboard";
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
