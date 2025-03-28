import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models';
import { CustomerService } from '../../customer';
import { ProductService } from '../../product';
import { OrderService } from '../../order';
import { C } from '@angular/cdk/portal-directives.d-a65be59b';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  authService = inject(AuthenticationService)
  constomerService =     inject(CustomerService)
  productService =     inject(ProductService)
  orderService =     inject(OrderService)

  user = {} as User
  constructor(private router: Router) { }

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
      // Reload mock data when login happens
    this.constomerService.reload()
    this.productService.reload()
    this.orderService.reload()

    const user: User = Object.assign({}, this.user, this.form.value);
    this.authService.login(user).then(() => this.router.navigate(['/loading'])).
      catch(e => console.log(e))


  }
}
