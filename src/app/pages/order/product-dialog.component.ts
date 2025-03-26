import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog'

import { Product } from '../product';
import { ProductService } from '../product';

import { CustomerService, Customer } from "../customer";
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { NumberValidators } from 'src/app/shared';

@Component({
    templateUrl: './product-dialog.component.html',
    imports:[MatFormFieldModule,MatDialogModule,ReactiveFormsModule, NgIf]
})
export class ProductDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public readonly ACTION_CANCEL: string = "CANCEL";
    public readonly ACTION_SAVE: string = "SAVE";

    pageTitle: string = 'Add product to order';
    errorMessage: string;
    productForm: FormGroup;

    product: Product;
    // private sub: Subscription;
    showImage: boolean;
    customers: Customer[];

    // Use with the generic validation messcustomerId class
    displayMessage: { [key: string]: string } & any = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    // private genericValidator: GenericValidator;

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private customerService: CustomerService,
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ProductDialogComponent>
    ) {

        // Defines all of the validation messcustomerIds for the form.
        // These could instead be retrieved from a file or database.
        this.validationMessages = {
            product: {
                required: 'Product first name is required.',
                minlength: 'Product first name must be at least one characters.',
                maxlength: 'Product first name cannot exceed 100 characters.'
            },
            price: {
                range: 'Rewards of the product must be between 1 (lowest) and 9999 (highest).'
            },
            unitInStock: {
                range: 'Rewards of the product must be between 1 (lowest) and 20 (highest).'
            },
            customerId: {
                range: 'Rewards of the product must be between 1 (lowest) and 99999 (highest).'
            }
        };

        // this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void {
        this.productForm = this.fb.group({
            product: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            price: ['', NumberValidators.range(1, 99999)],
            unitInStock: ['', NumberValidators.range(1, 20)],
            customerId: ['', NumberValidators.range(1, 9999999)],
            membership: false,
        });

        // Read the product Id from the route parameter
        // this.sub = 
        this.route.params.subscribe(
            params => {
                let id = params['id'];
                this.getProduct(id);
            }
        );

        this.getCustomers();
    }

    ngOnDestroy(): void {
        // this.sub.unsubscribe();
    }

    ngAfterViewInit(): void {
        // // Watch for the blur event from any input element on the form.
        // let controlBlurs: Observable<any>[] = this.formInputElements
        //     .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // // Merge the blur event observable with the valueChanges observable
        // Observable.merge(this.productForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
        //     this.displayMessage = this.genericValidator.processMessages(this.productForm);
        // });
    }

    getProduct(id: string): void {
        this.productService.getProduct(id)
            // .subscribe(
            // (product: Product) => this.onProductRetrieved(product),
            // (error: any) => this.errorMessage = <any>error
            // );
    }


    getCustomers() {
        this.customerService.getCustomers()
            .subscribe(customers => {
                this.customers = customers;
            },
            error => this.errorMessage = <any>error);
    }


    onProductRetrieved(product: Product): void {
        if (this.productForm) {
            this.productForm.reset();
        }
        this.product = product;

        if (this.product.id ) {
            this.pageTitle = 'Add Product';
        } else {
            this.pageTitle = `Edit Product: ${this.product.name} ${this.product.price}`;
        }

        // Update the data on the form
        this.productForm.patchValue({
            product: this.product.name,
            price: this.product.price,
            unitInStock: this.product.unitInStock
        });
    }

    deleteProduct(): void {
        if (this.product.id ) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
        } else {
            if (confirm(`Really delete the product: ${this.product.name}?`)) {
                // this.productService.deleteProduct(this.product.id)
                //     .subscribe(
                //     () => this.onSaveComplete(),
                //     (error: any) => this.errorMessage = <any>error
                //     );
            }
        }
    }

    saveProduct(): void {
        if (this.productForm.dirty && this.productForm.valid) {
            // Copy the form values over the product object values
            let p = Object.assign({}, this.product, this.productForm.value);

            this.productService.saveProduct(p)
                .subscribe(
                () => this.onSaveComplete(),
                (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.productForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.productForm.reset();
        this.router.navigate(['/products']);
    }
}
