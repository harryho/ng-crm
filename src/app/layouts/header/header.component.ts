import {
  Component,
  Output,
  EventEmitter,
  Input,
  inject,
  OnInit,
  effect,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  router = inject(Router);
  authService = inject(AuthenticationService);
  cartService = inject(CartService);

  /**
   * True for ~600ms after the cart gets a new line item. Drives a CSS
   * pulse animation so the user notices "I just added a new product."
   * Quantitiy bumps on an existing line don't trigger this - lineCount
   * only goes up when a brand-new product enters the cart.
   */
  pulse = false;

  private prevLineCount = -1;
  private pulseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const count = this.cartService.lineCount();
      // prevLineCount starts at -1 so the very first effect run (after
      // ensureLoaded hydrates the cart) doesn't pulse. After that,
      // any increase pulses.
      if (this.prevLineCount >= 0 && count > this.prevLineCount) {
        this.pulse = true;
        if (this.pulseTimer) clearTimeout(this.pulseTimer);
        this.pulseTimer = setTimeout(() => {
          this.pulse = false;
          this.pulseTimer = null;
        }, 600);
      }
      this.prevLineCount = count;
    });
  }

  async ngOnInit(): Promise<void> {
    // Hydrate the cart so the badge shows the real count (not 0) on
    // first render. ensureLoaded is idempotent and safe to call from
    // any component that needs the cart visible.
    await this.cartService.ensureLoaded();
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/auth/login']));
  }
}