import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IOrder } from './order';
import { OrderService } from './order.service';

@Component({
    templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Order Detail';
    order: IOrder;
    errorMessage: string;
    private sub: Subscription;
    imcustomerIdWidth: number = 80;
    imcustomerIdMargin: number = 2;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getOrder(id);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getOrder(id: number) {
        this.orderService.getOrder(id).subscribe(
            order => this.onOrderRetrieved(order),
            error => this.errorMessage = <any>error);
    }

    onOrderRetrieved(order: IOrder): void {
        this.order = order;
        this.pageTitle = `Order Detail: ${this.order.reference}`;
    }

    onBack(): void {
        this.router.navigate(['/orders']);
    }

}
