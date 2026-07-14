import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Product } from '../../models/domain/product';
import { Category } from '../../models/domain/category';
import { ProductService } from '../../services/product.service';
import { Repository } from '../../data/repository';

import { NumberValidators } from '../../shared/number.validator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styles: [
    `
      .button-float-right {
        float: right;
      }
      .title-spacer {
        flex: 1 1 auto;
      }
      .form-field {
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
      }
    `,
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
    MatLabel,
  ],
})
export class ProductFormComponent implements OnInit {
  IMAGE_PLACEHOLDER = 'https://picsum.photos/seed/placeholder/600/400';

  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  private repo = inject(Repository);
  fb = inject(FormBuilder);

  errorMessage: string;
  productForm: FormGroup;

  imageWidth = 200;
  imageMargin = 5;

  pageTitle = signal('');
  product = signal<Product | null>(null);
  categories = signal<Category[]>([]);

  ValidatorMessages = {
    name: {
      required: 'Product name is required.',
      minlength: 'Product name must be at least 3 characters.',
      maxlength: 'Product name cannot exceed 200 characters.',
    },
    price: {
      range: 'Price of the product must be between 1 and 99999.',
    },
    stock: {
      range: 'Stock of the product must be between 0 and 2000.',
    },
    imageUrl: { required: 'Image URL is required.' },
    brand: { required: 'Brand is required.' },
    categoryId: { required: 'Category is required.' },
  } as const;

  getImage(product: Product | null) {
    return product?.imageUrl ? product.imageUrl : this.IMAGE_PLACEHOLDER;
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: [''],
      brand: ['', Validators.required],
      categoryId: [null, Validators.required],
      price: [0, [Validators.required, NumberValidators.range(1, 99999)]],
      retailPrice: [0, NumberValidators.range(1, 99999)],
      stock: [0, [Validators.required, NumberValidators.range(0, 2000)]],
      status: ['standard', Validators.required],
      colors: [''],
      imageUrl: ['', [Validators.required]],
    });

    this.route.paramMap.subscribe(async (params) => {
      const idParam = params.get('id');
      const cats = await firstValueFrom(this.repo.listCategories());
      this.categories.set(cats);
      if (idParam) {
        const id = Number(idParam);
        const product = await firstValueFrom(this.productService.get(id));
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            brand: product.brand,
            categoryId: product.categoryId,
            price: product.price,
            retailPrice: product.retailPrice,
            stock: product.stock,
            status: product.status,
            colors: (product.colors ?? []).join(','),
            imageUrl: product.imageUrl,
          });
          this.product.set(product);
          this.pageTitle.set('Edit Product');
        } else {
          this.pageTitle.set('Product Not Found');
        }
      } else {
        this.pageTitle.set('New Product');
      }
    });
  }

  saveProduct(): void {
    if (this.productForm.dirty && this.productForm.valid) {
      const v = this.productForm.value;
      const existing = this.product();
      const saved: Product = {
        id: existing?.id ?? 0,
        name: v.name,
        description: v.description ?? '',
        brand: v.brand,
        categoryId: v.categoryId,
        price: v.price,
        retailPrice: v.retailPrice,
        stock: v.stock,
        status: v.status,
        colors: typeof v.colors === 'string' && v.colors.length
          ? v.colors.split(',').map((c: string) => c.trim()).filter(Boolean)
          : [],
        imageUrl: v.imageUrl,
      };
      this.productService.save(saved).subscribe(() => this.onSaveComplete());
    } else if (!this.productForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.productForm.reset();
    this.router.navigate(['/product']);
  }
}