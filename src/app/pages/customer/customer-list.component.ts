import { Component, inject, resource, signal, ViewChild } from '@angular/core';

import { Customer } from './customer';
import { CustomerService } from './customer.service';
import * as _ from 'lodash';

import { MatDialog } from '@angular/material/dialog'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ConfirmDialog } from 'src/app/shared/dialog.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';



@Component({
    selector: 'customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.css'],
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
        MatInput,
        MatProgressBar,


    ]
})
export class CustomerListComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    customerService = inject(CustomerService)
    pageTitle: string = 'Customers';
    AVATAR_PLACEHOLDER = '/assets/images/avatar/avatar-0.webp'
    imageWidth: number = 30;
    imageMargin: number = 2;
    // showImage: boolean = false;
    // listFilter: any = {};
    // errorMessage: string;
    searchFilter: any = {
        firstname: "",
        lastname: "",
        email: ""
    };
    query = signal('');
    // snackBar: MatSnackBar;
    readonly dialog = inject(MatDialog);
    readonly snackBar = inject(MatSnackBar);
    dataSource = signal(new MatTableDataSource([] as Customer[]))

    displayedColumns = ["avatar", "firstname", "lastname", "email", "membership", "hasItemInShoppingCart", "id"];
    customers = resource<Customer[], { query: string }>(
        {
            request: () => ({ query: this.query() }),
            loader: async ({ request, abortSignal }) => {
                const filteredList = await this.customerService.fetchDataWithFilter({ request, abortSignal })
                const ds = new MatTableDataSource(filteredList as Customer[])
                ds.paginator = this.paginator;
                ds.sort = this.sort;
                this.dataSource.set(ds)
                return filteredList

            }

        });

    pager: any = {};
    pagedItems: any[];

    selectedOption: string;


    reload() {
        this.query.set('')
        this.customers.reload()
    }

    getAvatar(customer: Customer) {
        return (customer.avatar) ? customer.avatar : this.AVATAR_PLACEHOLDER
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
                this.customerService.deleteCustomer(id).subscribe(
                    () => {
                        this.openSnackBar("The item has been deleted successfully. ", "Close")
                        this.customers.reload()
                    }
                );
            }
        });
    }



}
