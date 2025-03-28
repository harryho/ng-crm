import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  signal,
  inject
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  ReactiveFormsModule
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Product } from "./product";
import { ProductService } from "./product.service";
import { NumberValidators } from "src/app/shared";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { Customer, CustomerService } from "../customer";

@Component({
  selector: 'product-form',
  templateUrl: "./product-form.component.html",
  styles: [
    `  
    .button-float-right {
      float: right;
     }
    .title-spacer {
      flex: 1 1 auto;
    }
  .form-field{
      width: 100%;
      margin-left: 20px;
      margin-right: 20px;
    }
   
    `
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatLabel
  ]
})
export class ProductFormComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  // IMAGE_URI_PLACEHOLDER = '/assets/images/product/product-0.webp'
  IMAGE_URI_PLACEHOLDER = '/assets/images/product/product-0.webp'
  AVATAR_PLACEHOLDER = '/assets/images/avatar/avatar-0.webp'

  route = inject(ActivatedRoute)
  router = inject(Router)
  productService = inject(ProductService)
  constomerService = inject(CustomerService)
  fb = inject(FormBuilder)

  formInputElements: ElementRef[];
  errorMessage: string;
  productForm: FormGroup;

  showImage: boolean;
  imageWidth: number = 200;
  imageMargin: number = 5;
  fieldColspan = 2;

  pageTitle = signal('');
  product = signal({} as Product)
  customer = signal({} as Customer)
  // Use with the generic validation messageId class
  displayMessage: { [key: string]: string } & any = {};
  ValidatorMessages: { [key: string]: { [key: string]: string } } & any = {
    name: {
      required: "Product name is required.",
      minlength: "Product name must be at least one characters.",
      maxlength: "Product name cannot exceed 200 characters."
    },
    price: {
      range:
        "Price of the product must be between 1 (lowest) and 9999 (highest)."
    },
    unitInStock: {
      range:
        "Unit In Stock of the product must be between 1 (lowest) and 2000 (highest)."
    }
  }


  getImage(product: Product) {
    return (product.imageUri) ? product.imageUri : this.IMAGE_URI_PLACEHOLDER
  }



  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ["", [Validators.required,
      Validators.minLength(3), Validators.maxLength(100)]
      ],
      price: ["", [Validators.required, , NumberValidators.range(1, 99999)]],
      retailPrice: ["", NumberValidators.range(1, 99999)],
      unitInStock: ["", NumberValidators.range(1, 2000)],
      // category: [""],
    });


    // Read the product Id from the route parameter
    // @ts-ignore
    this.route.paramMap.subscribe(
      async (params) => {
        let id = params.get('id')
        if (id) {
          console.log(id)

          const product = await this.productService.getProduct(id)
          const customer = await this.constomerService.getCustomer(id)

          this.productForm.patchValue({
            name: product.name,
            price: product.price,
            retailPrice: product.retailPrice,
            unitInStock: product.unitInStock,

          });
          // this.avatar.set(product.avatar)
          this.product.set(product)
          this.pageTitle.set('Edit Product')
          this.customer.set(customer)
        }
        else {
          this.pageTitle.set('New Product')
        }
      });

  }




  saveProduct(): void {
    if (this.productForm.dirty && this.productForm.valid) {
      // Copy the form values over the product object values
      let p = Object.assign({}, this.product(), this.productForm.value);

      this.productService
        .saveProduct(p)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => (this.errorMessage = <any>error)
        );
    } else if (!this.productForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.productForm.reset();
    this.router.navigate(["/product"]);
  }


}
