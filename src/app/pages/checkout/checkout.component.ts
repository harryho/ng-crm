import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { firstValueFrom } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { Address } from '../../models/domain/address';


@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styles: [
    `
      .section-title {
        margin: 16px 0 8px 0;
        font-weight: 600;
      }
      .totals {
        text-align: right;
        padding: 16px;
        font-size: 18px;
      }
    `,
  ],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);

  shippingForm: FormGroup;
  errorMessage = signal('');
  processing = signal(false);

  async ngOnInit(): Promise<void> {
    await this.cartService.ensureLoaded();

    // Pre-fill the shipping address from the active user (id 1 in
    // this demo - matches CartService's default user id).
    const user = await firstValueFrom(this.userService.get(1));

    this.shippingForm = this.fb.group({
      street: [user?.address.street ?? '', Validators.required],
      city: [user?.address.city ?? '', Validators.required],
      state: [user?.address.state ?? ''],
      zipcode: [user?.address.zipcode ?? '', Validators.required],
      country: [user?.address.country ?? '', Validators.required],
    });
  }

  async confirmOrder(): Promise<void> {
    if (!this.shippingForm.valid) return;
    this.processing.set(true);
    this.errorMessage.set('');
    try {
      const address: Address = this.shippingForm.value;
      const order = await this.cartService.checkout(address);
      if (!order) {
        this.errorMessage.set('Your cart is empty.');
        return;
      }
      // Navigate to the new order's detail page.
      this.router.navigate(['/order/edit', order.id]);
    } catch (err: any) {
      this.errorMessage.set(err?.message ?? 'Checkout failed.');
    } finally {
      this.processing.set(false);
    }
  }
}