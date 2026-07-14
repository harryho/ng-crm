import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Order } from '../../models/domain/order';
import { Carrier } from '../../models/domain/carrier';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Repository } from '../../data/repository';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { User } from '../../models/domain/user';

/**
 * Order detail page - VIEW-ONLY.
 *
 * Per the lessons-learned doc's scope rules, "manual 'create a new Order'
 * admin form was removed entirely once a domain model where orders
 * originate from a cart/checkout flow existed - fabricating an order from
 * scratch via an admin form doesn't make sense once there's a real
 * checkout path that's supposed to be the only way orders get created."
 *
 * This component therefore only displays an existing order - line items,
 * status history, payment, shipment, shipping address - and offers a
 * status-advance action for the (demo) admin to drive the lifecycle.
 */
@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styles: [
    `
      .button-float-right { float: right; }
      .section-title {
        margin: 16px 0 8px 0;
        font-weight: 600;
      }
      .timeline-step {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding: 8px 12px;
        background: #f5f5f5;
        border-radius: 4px;
      }
      .timeline-step.current {
        background: #fff3e0;
        border-left: 3px solid #ff9800;
      }
      .timeline-step.done {
        background: #e8f5e9;
      }
      .timeline-step.cancelled {
        background: #ffebee;
        color: #b71c1c;
      }
      .timeline-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #9e9e9e;
        margin-right: 12px;
      }
      .timeline-dot.current { background: #ff9800; }
      .timeline-dot.done { background: #4caf50; }
      .timeline-dot.cancelled { background: #b71c1c; }
    `,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
  ],
})
export class OrderFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);
  userService = inject(UserService);
  private repo = inject(Repository);

  pageTitle = signal('');
  order = signal<Order | null>(null);
  user = signal<User | null>(null);
  carrier = signal<Carrier | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const idParam = params.get('id');
      if (!idParam) {
        this.pageTitle.set('Order Not Found');
        return;
      }
      const id = Number(idParam);
      const order = await firstValueFrom(this.orderService.get(id));
      if (!order) {
        this.pageTitle.set('Order Not Found');
        return;
      }
      this.order.set(order);
      this.pageTitle.set(`Order ${order.reference}`);
      const user = await firstValueFrom(this.userService.get(order.userId));
      this.user.set(user);
      if (order.shipment.carrierId !== null) {
        const carrier = await firstValueFrom(this.repo.getCarrier(order.shipment.carrierId));
        this.carrier.set(carrier);
      }
    });
  }

  /**
   * Advance the order to the next status in the lifecycle. Demo-only:
   * admin manually triggers transitions that, in a real system, would be
   * driven by external events (payment webhook, shipment scan, etc.).
   */
  advanceStatus(): void {
    const o = this.order();
    if (!o) return;
    const next = nextStatus(o.status.status);
    if (!next) return;
    this.orderService
      .appendStatus(o.id, { status: next.status, at: new Date().toISOString().slice(0, 10), note: next.note })
      .subscribe((updated) => {
        if (updated) {
          this.order.set(updated);
          if (updated.shipment.carrierId !== null && !this.carrier()) {
            firstValueFrom(this.repo.getCarrier(updated.shipment.carrierId)).then((c) =>
              this.carrier.set(c),
            );
          }
        }
      });
  }

  backToList(): void {
    this.router.navigate(['/order']);
  }
}

function nextStatus(current: Order['status']['status']):
  | { status: Order['status']['status']; note?: string }
  | null {
  switch (current) {
    case 'pending':
      return { status: 'paid', note: 'Payment captured' };
    case 'paid':
      return { status: 'packing', note: 'Order packed' };
    case 'packing':
      return { status: 'shipping', note: 'Handed to carrier' };
    case 'shipping':
      return { status: 'customs-clearance', note: 'Held at customs' };
    case 'customs-clearance':
      return { status: 'delivered', note: 'Delivered' };
    default:
      return null;
  }
}