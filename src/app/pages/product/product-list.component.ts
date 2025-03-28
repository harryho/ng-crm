import { Component, inject, resource, signal, ViewChild } from '@angular/core';

import { Product } from './product';
import { ProductService } from './product.service';

import * as _ from 'lodash';
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
import { ConfirmDialog } from 'src/app/shared';
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
        MatProgressBar
    ]
})
export class ProductListComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    service = inject(ProductService)
    readonly dialog = inject(MatDialog);
    readonly snackBar = inject(MatSnackBar);

    pageTitle: string = 'Products';

    showImage: boolean = false;

    displayedColumns = ["name", "price", "unitInStock", "categoryName", "id"];

    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {};
    selectedOption: string;

    query = signal('');

    pageIndex = signal(0)
    pageSize = signal(10)
    paginatorLength = signal(0)

    filteredList = signal([] as Product[])
    paginatedList = signal([] as Product[])


    handlePageEvent(e: PageEvent) {

        this.pageIndex.set(e.pageIndex)
        this.pageSize.set(e.pageSize)
        const fl = this.filteredList();
        console.log(this.pageIndex(), '   ', this.pageSize())
        const start = this.pageIndex() * this.pageSize()
        const paginatedList = fl.slice(start, start + this.pageSize())
        this.paginatedList.set(paginatedList)
    }

    products = resource<Product[], { query: string }>(
        {
            request: () => ({ query: this.query() }),
            loader: async ({ request, abortSignal }) => {
                const filteredList = await this.service.fetchDataWithFilter({ request, abortSignal })
                          this.filteredList.set(filteredList)
                this.paginatorLength.set(filteredList.length)
                const paginatedList = filteredList.slice(this.pageIndex() * this.pageSize(), this.pageSize())
                this.paginatedList.set(paginatedList)
                return filteredList
            }

        });
        
    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    reload() {
        this.query.set('')
        this.products.reload()
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }

    openDialog(id: string, enterAnimationDuration = '0ms', exitAnimationDuration = '0ms') {
        let dialogRef = this.dialog.open(ConfirmDialog,
            {
                width: '350px',
                enterAnimationDuration,
                exitAnimationDuration,
            }
        );
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
            if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
                this.service.deleteProduct(id).subscribe(
                    () => {
                        this.openSnackBar("The item has been deleted successfully. ", "Close")
                        this.products.reload()
                    }
                );
            }
        });
    }

}
