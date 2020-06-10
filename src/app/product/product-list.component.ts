import { Component, OnInit, ViewChild } from '@angular/core';

import { Product } from './product';
import { ProductService } from './product.service';
import { PagerService } from '../_services';
import { ConfirmDialog } from '../shared';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';


@Component({
    selector: 'product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    providers: [ConfirmDialog]
})
export class ProductListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    pageTitle: string = 'Products';

    showImage: boolean = false;
    listFilter: any = {};
    errorMessage: string;

    products: Product[];
    productList: Product[];

    displayedColumns = ["productName", "unitPrice", "unitInStock", "categoryName", "id"];
    dataSource: any = null;
    pager: any = {};
    pagedItems: any[];
    searchFilter: any = {};
    selectedOption: string;



    constructor(
        private productService: ProductService,
        // private pagerService: PagerService,
        public dialog: MatDialog, public snackBar: MatSnackBar) {
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    freshDataList(products: Product[]) {
        this.products = products;

        this.productList = products.map(e => {
            const product = e;
            e["categoryName"] = e["category"]["categoryName"];
            return product;
        });

        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    ngOnInit(): void {
        this.productService.getProducts()
            .subscribe(products => {
                this.freshDataList(products);
            },
            error => this.errorMessage = <any>error);

        this.searchFilter = {};
        this.listFilter = {};
    }

    getProducts(pageNum?: number) {
        this.productService.getProducts()
            .subscribe(products => {
                this.freshDataList(products);
            },
            error => this.errorMessage = <any>error);
    }

    searchProducts(filters: any) {
        if (filters) {
            this.productService.getProducts()
                .subscribe(products => {
                    this.products = products;
                    console.log(this.products.length)
                    this.products = this.products.filter((product: Product) => {
                        let match = true;

                        Object.keys(filters).forEach((k) => {
                            match = match && filters[k] ?
                                product[k] && product[k].toLocaleLowerCase().indexOf(filters[k].toLocaleLowerCase()) > -1 : match;
                        })
                        return match;
                    });
                    this.freshDataList(products);
                },
                error => this.errorMessage = <any>error);
        }

    }

    resetListFilter() {
        this.listFilter = {};
        this.getProducts();
    }

    reset() {
        this.listFilter = {};
        this.searchFilter = {};
        this.getProducts();
    }

    resetSearchFilter(searchPanel: any) {
        searchPanel.toggle();
        this.searchFilter = {};
        this.getProducts();
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 1500,
        });
    }

    openDialog(id: number) {
        let dialogRef = this.dialog.open(ConfirmDialog,
            { data: { title: 'Dialog', message: 'Are you sure to delete this item?' } });
        dialogRef.disableClose = true;


        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;

            if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
                this.productService.deleteProduct(id).subscribe(
                    () => {
                        this.productService.getProducts()
                            .subscribe(products => {
                                this.freshDataList(products);
                            },
                            error => this.errorMessage = <any>error);
                        this.openSnackBar("The item has been deleted successfully. ", "Close");
                    },
                    (error: any) => {
                        this.errorMessage = <any>error;
                        console.log(this.errorMessage);
                        this.openSnackBar("This item has not been deleted successfully. Please try again.", "Close");
                    }
                );
            }
        });
    }
}
