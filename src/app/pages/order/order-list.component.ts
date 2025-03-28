import { Component, inject, resource, signal, ViewChild } from "@angular/core";

import { Order } from "./order";
import { OrderService } from "./order.service";

import * as _ from "lodash";
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCell, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmDialog } from "src/app/shared";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { MatMiniFabButton, MatIconButton, MatButtonModule } from "@angular/material/button";
@Component({
  selector: 'order-list',
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
  providers: [ConfirmDialog],
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatToolbarModule,
    MatFormField,
    MatLabel,
    MatTableModule,
    MatInput,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMiniFabButton,
    MatCell,
    MatMenu,
    MatIconButton,
    MatButtonModule,
    MatProgressBar
]
})
export class OrderListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  service = inject(OrderService)
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  pageTitle: string = "Orders";

  orderList: Order[]; //
  displayedColumns = [" ", "reference",  "amount", "customer", "orderDate", "shippedDate", "delivery", "id"];

  displayedColumnsExpand = ["expand", "reference", "amount", "customer", "orderDate", "shippedDate","delivery", "id"]

  displayedColumnHeaders: any = {
    "reference": "Reference No.",
    "quantity": "Quantity", "amount": "Total Price", "customer": "Customer", "orderDate": "Billing Date",
    "shippedDate": "Shipping Date", "delivery":"Delivery Status","id": ""
  };
  // pager: any = {};
  // pagedItems: any[];
  // totalAmount: number;
  searchFilter: any = {
    reference: "",
    amount: "",
    quantity: ""

  };
  selectedOption: string;

  query = signal('');
  // query2 = signal('');
  dataSource = signal(new MatTableDataSource([] as Order[]))

  expandedElement: Order | null;

  /** Checks whether an element is expanded. */
  isExpanded(element: Order) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: Order) {
    // console.log(JSON.stringify(element))
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  orders = resource<Order[], { query: string }>(
    {
      request: () => ({ query: this.query() }),
      loader: async ({ request, abortSignal }) => {
        // this.customerService.useMock()
        const filteredList = await this.service.fetchDataWithFilter({ request, abortSignal })
        const ds = new MatTableDataSource(filteredList as Order[])
        ds.paginator = this.paginator;
        ds.sort = this.sort;
        this.dataSource.set(ds)
        return filteredList
      }

    });

  reload() {
    this.query.set('')
    this.orders.reload()
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500
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
        this.service.deleteOrder(id).subscribe(
          () => {
            this.openSnackBar("The item has been deleted successfully. ", "Close")
            this.orders.reload()
          }
        );
      }
    });
  }



}
