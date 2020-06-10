import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  ElementRef,

} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,

} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { IOrder } from "./order";
import { OrderService } from "./order.service";

import { NumberValidators } from "../shared/number.validator";
import { GenericValidator } from "../shared/generic-validator";
import { CustomerService, Customer } from "../customer";
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from "./product-dialog.component";
import { ConfirmDialog } from "../shared";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Product } from '../product';

@Component({
  selector: 'order-form',
  templateUrl: "./order-form.component.html",
  styles: [`
  .title-spacer {
      flex: 1 1 auto;
    }
  .form-field{
      width: 100%;
      margin-left: 20px;
      margin-right: 20px;
    }
    `],
  providers: [ProductDialogComponent]
})
export class OrderFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  pageTitle: string = "Update Order";
  errorMessage: string;
  orderForm: FormGroup;
  order: IOrder = <IOrder>{};
  showImage: boolean;
  customers: Customer[];
  fieldColspan = 4;
  // Use with the generic validation messcustomerId class
  displayMessage: { [key: string]: string } = {};
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
    this.sub = this.route.params.subscribe(params => {
      let id = +params["id"];
      this.getOrder(id);
    });

    this.getCustomers();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) =>
        Observable.fromEvent(formControl.nativeElement, "blur")
    );

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.orderForm.valueChanges, ...controlBlurs)
      .debounceTime(800)
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(
          this.orderForm
        );
      });
  }

  getOrder(id: number): void {
    this.orderService
      .getOrder(id)
      .subscribe(
        (order: IOrder) => this.onOrderRetrieved(order),
        (error: any) => (this.errorMessage = <any>error)
      );
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    }, error => (this.errorMessage = <any>error));
  }

  onOrderRetrieved(order: IOrder): void {
    if (this.orderForm) {
      this.orderForm.reset();
    }
    this.order = order;

    if (this.order.id === 0) {
      this.pageTitle = "Add Order";
    } else {
      this.pageTitle = `Update Order: ${this.order.reference} `;
    }

    // Update the data on the form
    this.orderForm.patchValue({
      reference: this.order.reference,
      amount: this.order.amount,
      quantity: this.order.products.length,
      orderDate: new Date(this.order.orderDate),
      shippedDate: new Date(this.order.shippedDate),
      address: this.order.shipAddress.address,
      city: this.order.shipAddress.city,
      country: this.order.shipAddress.country,
      zipcode: this.order.shipAddress.zipcode,
      customerId: this.order.customerId,
      membership: this.order.membership
    });

    const products = this.order.products.map(product =>
      this.fb.group({
        productName: [product.productName],
        price: [product.unitPrice]
      })
    );
    const productList = this.fb.array(products);
    this.orderForm.setControl("products", productList);
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
