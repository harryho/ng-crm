import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ICustomer } from './customer';
import { CustomerService } from './customer.service';

@Component({
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Customer Detail';
    customer: ICustomer;
    errorMessage: string;
    private sub: Subscription;
    imageWidth: number = 80;
    imageMargin: number = 2;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getCustomer(id);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getCustomer(id: number) {
        this.customerService.getCustomer(id).subscribe(
            customer => this.onCustomerRetrieved(customer),
            error => this.errorMessage = <any>error);
    }

    onCustomerRetrieved(customer: ICustomer): void {
        this.customer = customer;

        this.pageTitle = `Customer Detail: ${this.customer.firstName} ${this.customer.lastName}`;

    }


    onBack(): void {
        this.router.navigate(['/customers']);
    }

}
