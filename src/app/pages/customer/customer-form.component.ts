import { Component, OnInit, ViewChildren, ElementRef, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from './customer';
import { CustomerService } from './customer.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { NumberValidators } from '../../shared/number.validator';
import { GenericValidator } from '../../shared/generic-validator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'customer-form',
    templateUrl: './customer-form.component.html',
    styles: [`
    .button-float-right {
       float: right;
      }
    .form-field{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
    }
    .avatar-field {
        left: 0;
        margin: 0 auto;
        position: absolute;
        margin-left: 50px;
    }
    `],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatFormField, 
        MatLabel,
        RouterModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
    ]
})
export class CustomerFormComponent implements OnInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    route = inject(ActivatedRoute)
    router = inject(Router)
    service = inject(CustomerService)
    fb = inject(FormBuilder)

    AVATAR_PLACEHOLDER = '/assets/images/avatar/avatar-0.webp'

    errorMessage: string;
    customerForm: FormGroup;
    private sub: Subscription;
    showImage: boolean;
    imageWidth: number = 50;
    imageMargin: number = 5;
    fieldColspan = 3;

    pageTitle = signal('');
    customer = signal({} as Customer)

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    ValidatorMessages: { [key: string]: { [key: string]: string } | {} } & any = {
        firstname: {
            required: 'First name is required.',
            minlength: 'First name must be at least one characters.',
            maxlength: 'First name cannot exceed 100 characters.'
        },
        lastname: {
            required: 'Last name is required.',
            minlength: 'Last name must be at least one characters.',
            maxlength: 'Last name cannot exceed 100 characters.'
        },
        email: {
            required: 'Email is required.',
            minlength: 'Email must be at least one characters.',
            maxlength: 'Email cannot exceed 200 characters.'
        },
        rewards: {
            range: 'Rewards of the customer must be between 0 (lowest) and 150 (highest).'
        },
        phone: { maxlength: 'Phone cannot exceed 12 characters.' },
        mobile: { maxlength: 'Mobile cannot exceed 12 characters.' },
    };


    getAvatar(customer: Customer) {
        return (customer.avatar) ? customer.avatar : this.AVATAR_PLACEHOLDER
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
            rewards: ['', NumberValidators.range(0, 150)],
            phone: ['', Validators.maxLength(20)],
            mobile: ['', [Validators.required, Validators.maxLength(20)]],
            membership: false,
        });

        // Read the customer Id from the route parameter
        // @ts-ignore
        this.route.paramMap.subscribe(
            async (params) => {
                let id = params.get('id')
                if (id) {
                    console.log(id)
                    const customer = await this.service.getCustomer(id)
    
                    this.customerForm.patchValue({
                        firstname: customer.firstname,
                        lastname: customer.lastname,
                        email: customer.email,
                        rewards: customer.rewards,
                        phone: customer.phone,
                        mobile: customer.mobile,
                        membership: customer.membership
                    });
                    // this.avatar.set(customer.avatar)
                    this.customer.set(customer)
                    this.pageTitle.set('Edit Customer')
                }
                else {
                    // this.customer.set({} as Customer)
                    this.pageTitle.set('New Customer')
                }

            }
        )

    }

    // toggleImage(event: any): void {
    //     event.preventDefault();
    //     this.showImage = !this.showImage;
    // }


    saveCustomer(): void {
        if (this.customerForm.dirty && this.customerForm.valid) {
            // Copy the form values over the customer object values
            const customer = Object.assign({}, this.customer(), this.customerForm.value);
            customer.fullname = `${customer.firstname}  ${customer.lastname}`

            this.service.saveCustomer(customer)
                .subscribe( () => this.onSaveComplete())
        } else if (!this.customerForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.customerForm.reset();
        this.router.navigate(['/customer']);
    }
}

