import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
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

} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";



import { Order } from "./order";
import { OrderService } from "./order.service";


import { CustomerService, Customer } from "../customer";
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from "./product-dialog.component";

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Product } from '../product';
import { Subscription, Observable } from "rxjs";
import { GenericValidator, NumberValidators, ConfirmDialog } from "src/app/shared";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatGridList, MatGridListModule, MatGridTile, MatLine } from "@angular/material/grid-list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatList, MatListItem } from "@angular/material/list";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
  selector: 'order-form',
  templateUrl: "./order-form.component.html",
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
  providers: [ProductDialogComponent, provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormField,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
    , MatGridList, MatGridTile,
    MatDatepickerModule, MatList,
    MatListItem,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule, MatDatepickerModule]
})
export class OrderFormComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  // pageTitle: string = "Update Order";
  errorMessage: string;
  orderForm: FormGroup;
  // order: Order = <Order>{};
  showImage: boolean;
  customers: Customer[];
  fieldColspan = 4;
  pageTitle = signal('');
  order = signal({}as Order)
  // Use with the generic validation messcustomerId class
  displayMessage: { [key: string]: string } & any = {};
  private validationMessages: { [key: string]: { [key: string]: string } } = {
    reference: {
      required: "Order reference is required.",
      minlength: "Order reference must be at least one characters.",
      maxlength: "Order reference cannot exceed 100 characters."
    },
    amount: {
      required: "Order amount is required.",
      range:
        "Amount of the order must be between 1 (lowest) and 9999 (highest)."
    },
    quantity: {
      required: "Order quantity is required.",
      range:
        "Quantity of the order must be between 1 (lowest) and 20 (highest)."
    },
    customerId: {
      required: "Customer is required."
    }
  };
  private sub: Subscription;
  private genericValidator: GenericValidator;



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.onScreensizeChange();
    });

    this.genericValidator = new GenericValidator(this.validationMessages);
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
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      zipcode: ["", [Validators.required]],
      customerId: ["", Validators.required],
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
          address: order.shipAddress.address,
          city: order.shipAddress.city,
          country: order.shipAddress.country,
          zipcode: order.shipAddress.zipcode,
          customerId: order.customerId

        });

        const products = [] as any
        //  this.order.products.map(product =>
        //   this.fb.group({
        //     productName: [product.name],
        //     price: [product.price]
        //   })
        // );
        const productList = this.fb.array(products);
        this.orderForm.setControl("products", productList);
        this.pageTitle.set('Edit Order')
      }
      // else{
      //   // this.order.set({} as Customer)
      //   this.pageTitle.set('New Order')
      // }
    });

    this.getCustomers();
  }



  getCustomers() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    }, error => (this.errorMessage = <any>error));
  }

  // onOrderRetrieved(order: Order): void {
  //   if (this.orderForm) {
  //     this.orderForm.reset();
  //   }
  //   this.order = order;

  //   // if (this.order.id === 0) {
  //   //   this.pageTitle = "Add Order";
  //   // } else {
  //   //   this.pageTitle = `Update Order: ${this.order.reference} `;
  //   // }

  //   // Update the data on the form
  //   this.orderForm.patchValue({
  //     reference: this.order.reference,
  //     amount: this.order.amount,
  //     quantity: this.order.products.length,
  //     orderDate: new Date(this.order.orderDate),
  //     shippedDate: new Date(this.order.shippedDate),
  //     address: this.order.shipAddress.address,
  //     city: this.order.shipAddress.city,
  //     country: this.order.shipAddress.country,
  //     zipcode: this.order.shipAddress.zipcode,
  //     customerId: this.order.customerId,
  //     membership: this.order.membership
  //   });

  //   const products = this.order.products.map(product =>
  //     this.fb.group({
  //       name: [product.name],
  //       price: [product.price]
  //     })
  //   );
  //   const productList = this.fb.array(products);
  //   this.orderForm.setControl("products", productList);
  // }

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

  addProduct(event: any): void {


    let dialogRef = this.dialog.open(ProductDialogComponent, {
      height: "400px",
      width: "600px",
      data: { title: "Dialog" }// message: "Are you sure to add this item?" }
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      // this.selectedOption = result;
      if (result === dialogRef.componentInstance.ACTION_SAVE) {
        //     this.orderService.deleteOrder(id).subscribe(
        //         () => {
        //             this.orderService.getOrders()
        //                 .subscribe(orders => {
        //                     this.orders = orders;
        //                     this.setPage(1);
        //                 },
        //                 error => this.errorMessage = <any>error);
        //         },
        //         (error: any) => {
        //             this.errorMessage = <any>error;
        //             console.log(this.errorMessage);
        //             this.openSnackBar("This item has not been deleted successfully. Please try again.", "Close");
        //         }
        //     );
      }
    });
    event.preventDefault();
  }


  openDialog(product: Product) {
    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: "Dialog", message: "Are you sure to delete this item?" }
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(() => {
      // this.selectedOption = result;

      // if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
      //   this.orderService.deleteOrder(id).subscribe(
      //     () => {
      //       this.orderService.getOrders().subscribe(orders => {
      //         this.freshDataList(orders);
      //       }, error => (this.errorMessage = <any>error));
      //       this.openSnackBar("The item has been deleted successfully. ", "Close");
      //     },
      //     (error: any) => {
      //       this.errorMessage = <any>error;
      //       console.log(this.errorMessage);
      //       this.openSnackBar(
      //         "This item has not been deleted successfully. Please try again.",
      //         "Close"
      //       );
      //     }
      //   );
      // }
    });
  }

  onScreensizeChange() {
    // debugger
    const isLess600 = this.breakpointObserver.isMatched('(max-width: 599px)');
    const isLess1000 = this.breakpointObserver.isMatched('(max-width: 959px)');
    console.log(
      ` isLess600  ${isLess600} 
        isLess1000 ${isLess1000}  `
    )
    if (isLess1000) {
      if (isLess600) {
        this.fieldColspan = 12;
      }
      else {
        this.fieldColspan = 6;
      }
    }
    else {
      this.fieldColspan = 3;
    }
  }
  deleteProduct(): void { }
}
