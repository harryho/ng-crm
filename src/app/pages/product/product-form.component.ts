import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
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


import { Category } from "./index";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from "rxjs";
import { GenericValidator, NumberValidators } from "src/app/shared";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";

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
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatToolbarModule,
  ]
})
export class ProductFormComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  IMAGE_URI_PLACEHOLDER = '/assets/images/product/product-0.webp'

  route = inject(ActivatedRoute)
  router = inject(Router)
  service = inject(ProductService)
  fb = inject(FormBuilder)

  formInputElements: ElementRef[];


  errorMessage: string;
  productForm: FormGroup;

  showImage: boolean;
  categories: Category[];
  imageWidth: number = 200;
  imageMargin: number = 5;
  fieldColspan = 2;

  pageTitle = signal('');
  product = signal({} as Product)
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

  private genericValidator: GenericValidator;


  getImage(product: Product) {
    return (product.imageUri) ? product.imageUri : this.IMAGE_URI_PLACEHOLDER
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      price: ["",   [Validators.required,,NumberValidators.range(1, 99999)]],
      retailPrice: ["", NumberValidators.range(1, 99999)],
      unitInStock: ["", NumberValidators.range(1, 2000)],
      category: [""],
    });




    // Read the product Id from the route parameter
    // this.sub = 
    this.route.params.subscribe(
      async (params) => {
        let id = params["id"];
        if (id) {
          console.log(id)
          // this.getCustomer(id||"");

          const data = await fetch(`http://localhost:3333/products/${id}`);
          console.log(data)
          if (!data.ok) throw Error(`Could not fetch...`)
          const product = await data.json();
          console.log(product)
          console.log(product.values)

          this.productForm.patchValue({
            name: product.name,
            price: product.price,
            retailPrice:product.retailPrice,
            unitInStock: product.unitInStock,
            
          });
          // this.avatar.set(product.avatar)
          this.product.set(product)
          this.pageTitle.set('Edit Product')
        }
        else {
          this.product.set({} as Product)
          this.pageTitle.set('New Product')
        }
      });

    // this.getCategories();
  }




  getProduct(id: number): void {
    // this.productService
    //   .getProduct(id)
    //   .subscribe(
    //     (product: Product) => this.onProductRetrieved(product),
    //     (error: any) => (this.errorMessage = <any>error)
    //   );
  }

  getCategories(): void {
    // this.productService
    //   .getCategories()
    //   .subscribe(
    //     // categories => (this.categories = categories),
    //     // error => (this.errorMessage = <any>error)
    //   );
  }

  // onProductRetrieved(product: Product): void {
  //   if (this.productForm) {
  //     this.productForm.reset();
  //   }
  //   this.product = product;

  //   // if (this.product.id === 0) {
  //   //   this.pageTitle = "Add Product";
  //   // } else {
  //   //   this.pageTitle = `Update Product: ${this.product.name} `;
  //   // }

  //   // Update the data on the form
  //   this.productForm.patchValue({
  //     name: this.product.name,
  //     price: this.product.price,
  //     unitInStock: this.product.unitInStock,
  //     categoryId: this.product.categoryId
  //   });
  // }

  deleteProduct(): void {
    // if (this.product.id === 0) {
    //   // Don't delete, it was never saved.
    //   this.onSaveComplete();
    // } else {
    //   if (confirm(`Really delete the product: ${this.product.name}?`)) {
    //     this.productService
    //       .deleteProduct(this.product.id)
    //       .subscribe(
    //         () => this.onSaveComplete(),
    //         (error: any) => (this.errorMessage = <any>error)
    //       );
    //   }
    // }
  }

  saveProduct(): void {
    if (this.productForm.dirty && this.productForm.valid) {
      // Copy the form values over the product object values
      let p = Object.assign({}, this.product, this.productForm.value);

      // this.productService
      //   .saveProduct(p)
      //   .subscribe(
      //     () => this.onSaveComplete(),
      //     (error: any) => (this.errorMessage = <any>error)
      //   );
    } else if (!this.productForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.productForm.reset();
    this.router.navigate(["/products"]);
  }

  // onScreensizeChange() {
  //   // debugger
  //   const isLess600 = this.breakpointObserver.isMatched('(max-width: 599px)');
  //   const isLess1000 = this.breakpointObserver.isMatched('(max-width: 959px)');
  //   console.log(
  //     ` isLess600  ${isLess600} 
  //       isLess1000 ${isLess1000}  `
  //   )
  //   if (isLess1000) {
  //     if (isLess600) {
  //       this.fieldColspan = 12;
  //     }
  //     else {
  //       this.fieldColspan = 6;
  //     }
  //   }
  //   else {
  //     this.fieldColspan = 3;
  //   }
  // }
}
