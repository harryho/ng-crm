import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ICustomer } from './customer';
import { CustomerService } from './customer.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';


@Component({
    templateUrl: './customer-edit.component.html',
    styles: [`
    .example-section {
        display: flex;
        align-content: center;
        align-items: center;
        height: 60px;
        }

    .example-margin {
        margin: 0 10px;
        }
    `]
})
export class CustomerEditComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Update Customer';
    errorMessage: string;
    customerForm: FormGroup;

    customer: ICustomer = <ICustomer>{};
    private sub: Subscription;
    showImage: boolean;
    imageWidth: number = 80;
    imageMargin: number = 2;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private customerService: CustomerService) {

        // Defines all of the validation messages for the form.
        // These could instead be retrieved from a file or database.
        this.validationMessages = {
            firstName: {
                required: 'Customer first name is required.',
                minlength: 'Customer first name must be at least one characters.',
                maxlength: 'Customer first name cannot exceed 100 characters.'
            },
            lastName: {
                required: 'Customer last name is required.',
                minlength: 'Customer last name must be at least one characters.',
                maxlength: 'Customer last name cannot exceed 100 characters.'
            },
            email: {
                required: 'Customer email is required.',
                minlength: 'Customer email must be at least one characters.',
                maxlength: 'Customer email cannot exceed 200 characters.'
            },
            rewards: {
                range: 'Age of the customer must be between 0 (lowest) and 150 (highest).'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            lastName: ['', [Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)]],
            email: ['', [Validators.required,
            Validators.minLength(5),
            Validators.maxLength(200)]],
            rewards: ['', NumberValidators.range(0, 150)],
            membership: false,
        });

        // Read the customer Id from the route parameter
        this.sub = this.route.params.subscribe(
            params => {
                let id = +params['id'];
                this.getCustomer(id);
            }
        );

        this.sub.add(null);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.customerForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.customerForm);
        });
    }

    getCustomer(id: number): void {
        this.customerService.getCustomer(id)
            .subscribe(
            (customer: ICustomer) => this.onCustomerRetrieved(customer),
            (error: any) => this.errorMessage = <any>error
            );
    }

    onCustomerRetrieved(customer: ICustomer): void {
        if (this.customerForm) {
            this.customerForm.reset();
        }
        this.customer = customer;

        if (this.customer.id === 0) {
            this.pageTitle = 'Add Customer';
        } else {
            this.pageTitle = `Update Customer: ${this.customer.firstName} ${this.customer.lastName}`;
        }

        // Update the data on the form
        this.customerForm.patchValue({
            firstName: this.customer.firstName,
            lastName: this.customer.lastName,
            email: this.customer.email,
            rewards: this.customer.rewards,
            membership: this.customer.membership
        });
    }

    deleteCustomer(): void {
        if (this.customer.id === 0) {
            // Don't delete, it was never saved.
            this.onSaveComplete();
        } else {
            if (confirm(`Really delete the customer: ${this.customer.firstName}?`)) {
                this.customerService.deleteCustomer(this.customer.id)
                    .subscribe(
                    () => this.onSaveComplete(),
                    (error: any) => this.errorMessage = <any>error
                    );
            }
        }
    }

    toggleImage(): void {
        event.preventDefault();
        this.showImage = !this.showImage;
    }


    saveCustomer(): void {
        if (this.customerForm.dirty && this.customerForm.valid) {
            // Copy the form values over the customer object values
            const customer = Object.assign({}, this.customer, this.customerForm.value);

            this.customerService.saveCustomer(customer)
                .subscribe(
                () => this.onSaveComplete(),
                (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.customerForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.customerForm.reset();
        this.router.navigate(['/customers']);
    }
}
