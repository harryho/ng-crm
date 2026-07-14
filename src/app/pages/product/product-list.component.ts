import { Component, inject, resource, signal, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Product } from '../../models/domain/product';
import { Category } from '../../models/domain/category';
import { ProductService } from '../../services/product.service';
import { Repository } from '../../data/repository';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ConfirmDialog } from '../../shared/dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ConfirmDialog],
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatMiniFabButton,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatProgressBar,
  ],
})
export class ProductListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  service = inject(ProductService);
  private readonly repo = inject(Repository);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  pageTitle: string = 'Products';
  showImage: boolean = false;

  displayedColumns = ['image', 'name', 'brand', 'price', 'stock', 'categoryName', 'status', 'id'];

  query = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);
  paginatorLength = signal(0);

  filteredList = signal<Product[]>([]);
  paginatedList = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  handlePageEvent(e: PageEvent) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    const fl = this.filteredList();
    const start = this.pageIndex() * this.pageSize();
    this.paginatedList.set(fl.slice(start, start + this.pageSize()));
  }

  products = resource<Product[], { query: string }>({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      const filteredList = await firstValueFrom(this.service.filter(params.query));
      this.filteredList.set(filteredList);
      this.paginatorLength.set(filteredList.length);
      const start = this.pageIndex() * this.pageSize();
      this.paginatedList.set(filteredList.slice(start, start + this.pageSize()));
      const cats = await firstValueFrom(this.repo.listCategories());
      this.categories.set(cats);
      return filteredList;
    },
  });

  reload() {
    this.query.set('');
    this.products.reload();
  }

  categoryName(categoryId: number): string {
    return this.categories().find((c) => c.id === categoryId)?.name ?? '';
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 1500 });
  }

  openDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result) => {
      if (result === dialogRef.componentInstance.ACTION_CONFIRM) {
        this.service.delete(id).subscribe(() => {
          this.openSnackBar('The product has been deleted successfully.', 'Close');
          this.products.reload();
        });
      }
    });
  }
}