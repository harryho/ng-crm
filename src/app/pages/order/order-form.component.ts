import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  signal,

} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  ReactiveFormsModule,
  FormsModule,

} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";



import { Order } from "./order";
import { OrderService } from "./order.service";


import { CustomerService, Customer } from "../customer";
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from "./product-dialog.component";

import { BreakpointObserver } from '@angular/cdk/layout';
import { Product } from '../product';
import { NumberValidators } from "src/app/shared";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatList, MatListItem } from "@angular/material/list";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatStepperModule } from "@angular/material/stepper";

@Component({
  selector: 'order-form',
  templateUrl: "./order-form.component.html",
  styleUrls: ["./order-form.component.scss"],
  providers: [
    ProductDialogComponent,
    provideNativeDateAdapter(),
  ],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormField,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule
    , MatList,
    MatListItem,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule
  ]
})
export class OrderFormComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];

  errorMessage: string;
  orderForm: FormGroup;

  showImage: boolean;
  customers: Customer[];
  fieldColspan = 4;
  pageTitle = signal('');
  order = signal({} as Order)
  displayMessage: { [key: string]: string } & any = {};


  lineItems: Product[];
  delivery = signal('') as any
  deliveryStatus: any = {
    packing: '',
    shipping: '',
    customs: '',
    delvered: ''

  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    // breakpointObserver.observe([
    //   Breakpoints.HandsetLandscape,
    //   Breakpoints.HandsetPortrait
    // ]).subscribe(result => {
    //   this.onScreensizeChange();
    // });
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      reference: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      amount: ["", [Validators.required, NumberValidators.range(1, 99999)]],
      quantity: ["", [Validators.required, NumberValidators.range(1, 20)]],
      orderDate: [""],
      shippedDate: [""],
      street: ["", [Validators.required]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      zipcode: ["", [Validators.required]],
      customer: ["", Validators.required],
      products: this.fb.array([]),
      membership: false
    });

    // Read the order Id from the route parameter
    // this.sub =
    this.route.params.subscribe(async params => {
      let id = params["id"];
      if (id) {
        const order = await this.orderService.getOrder(id);
        this.orderForm.patchValue({
          reference: order.reference,
          amount: order.amount,
          // quantity: order.products.length,
          orderDate: new Date(order.orderDate),
          shippedDate: new Date(order.shippedDate),
          street: order.shipAddress.street,
          city: order.shipAddress.city,
          country: order.shipAddress.country,
          zipcode: order.shipAddress.zipcode,
          customer: order.customer,

        });
        this.lineItems = order.lineItems
        const products = [] as any
        // );
        const productList = this.fb.array(products);
        this.orderForm.setControl("products", productList);
        this.pageTitle.set('Edit Order')
        this.deliveryStatus = {
          packing: order.delivery == 'packing' ? 'active' : '',
          shipping: order.delivery == 'shipping' ? 'active' : '',
          customs: order.delivery == 'customs-clearance' ? 'active' : '',
          delvered: order.delivery == 'delivered' ? 'active' : '',
        }
        Object.keys(this.orderForm.controls)
          .forEach(k => this.orderForm.controls[k].disable())
      }
    });

    this.getCustomers();
  }

  disableStepper(event: any) {
    event.preventDefault()
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    }, error => (this.errorMessage = <any>error));
  }

  saveOrder(): void {
    if (this.orderForm.dirty && this.orderForm.valid) {
      // Copy the form values over the order object values
      const order = Object.assign({}, this.order, this.orderForm.value);

      this.orderService
        .saveOrder(order)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => (this.errorMessage = <any>error)
        );
    } else if (!this.orderForm.dirty && this.orderForm.valid) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.orderForm.reset();
    this.router.navigate(["/orders"]);
  }



}
