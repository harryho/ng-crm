import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart.service';

/**
 * Cart list page.
 *
 * Lists every line item in the active user's cart with inline quantity
 * controls (0 removes the line). The total is shown at the bottom.
 * "Proceed to Checkout" navigates to the checkout page; "Clear" empties
 * the cart.
 */
@Component({
  selector: 'cart-list',
  templateUrl: './cart-list.component.html',
  styles: [
    `
      .empty {
        text-align: center;
        padding: 32px;
        color: #888;
      }
      .cart-line {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px;
        border-bottom: 1px solid #eee;
      }
      .cart-line img {
        width: 64px;
        height: 64px;
        object-fit: cover;
        border-radius: 4px;
      }
      .cart-line .name {
        flex: 1;
        font-weight: 600;
      }
      .cart-line .qty {
        width: 80px;
      }
      .cart-line .price {
        width: 120px;
        text-align: right;
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
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class CartListComponent implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.cartService.ensureLoaded();
  }

  async setQty(productId: number, qty: number): Promise<void> {
    await this.cartService.setQuantity(productId, Number(qty) || 0);
  }

  async remove(productId: number): Promise<void> {
    await this.cartService.removeItem(productId);
  }

  async clear(): Promise<void> {
    await this.cartService.clear();
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}