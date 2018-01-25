import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IProduct } from './product';
import { ProductService } from './product.service';
import { WithCategory } from './index';

@Component({
    templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Product Detail';
    product: IProduct & WithCategory = <IProduct & WithCategory>{};
    errorMessage: string;
    private sub: Subscription;
    imcustomerIdWidth: number = 80;
    imcustomerIdMargin: number = 2;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getProduct(id);
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getProduct(id: number) {
        this.productService.getProduct(id).subscribe(
            product => this.onProductRetrieved(<IProduct & WithCategory>product),
            error => this.errorMessage = <any>error);
    }

    onProductRetrieved(product: IProduct & WithCategory): void {
        this.product = product;
        this.pageTitle = `Order Detail: ${this.product.productName}`;
    }

    onBack(): void {
        this.router.navigate(['/products']);
    }
}
