import { Component, inject, OnInit, resource, signal, ViewChild } from "@angular/core";

import { Order } from "./order";
import { OrderService } from "./order.service";

import * as _ from "lodash";
import {MatSnackBar} from '@angular/material/snack-bar';

import {MatDialog} from '@angular/material/dialog'
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
import { Product } from "../product";
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
export class OrderListComponent  {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  service = inject(OrderService)
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  
  pageTitle: string = "Orders";

  showImage: boolean = false;
  listFilter: any = {};
  errorMessage: string;

  orderList: Order[]; //
  displayedColumns = [ " ", "reference", "quantity", "amount", "customerName", "orderDate", "shippedDate", "id"];
  displayedColumnsEmpty = ["expand", "reference", "quantity", "amount", "customerName", "orderDate", "shippedDate", "id"];
  displayedColumnsExpand = [ "expand", "reference", "quantity", "amount", "customerName", "orderDate", "shippedDate", "id"]//, "shipAddress"]//,"id"];

  displayedColumnHeaders : any = { "reference": "Reference No.",
      "quantity": "Quantity", "amount":"Total Price", "customerName": "Customer", "orderDate":"Billing Date", 
      "shippedDate":"Shipping Date", "id":""};
  pager: any = {};
  pagedItems: any[];
  totalAmount: number;
  searchFilter: any = {
    reference: "",
    amount: "",
    quantity: ""

  };
  selectedOption: string;

  query = signal('');
  dataSource = signal(new MatTableDataSource([] as Order[]))
  
  orders = resource<Order[], { query: string }>(
      {
          request: () => ({ query: this.query() }),
          loader: async ({ request, abortSignal }) => {
              // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
              // indicates that the request has been aborted.
              const data = await fetch(`http://localhost:3333/orders`, { signal: abortSignal });
              console.log(data)
              if (!data.ok) throw Error(`Could not fetch...`)
              const list = await data.json();
              this.service.storeCount(list.length)
              // debugger
              const filteredList = list.filter((d: Order) => {
                  console.log(d.reference, '             ', request.query)
                  return !request.query ? true : (
                      d.reference && d.reference.toLowerCase().indexOf(request.query.toLowerCase()) > -1)
              })
              console.log(filteredList)


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

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500
    });
  }

  openDialog(id: string,enterAnimationDuration = '0ms', exitAnimationDuration = '0ms') {
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
      console.log('  dialog  result ', result)
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

  expandedElement: PeriodicElement | null;

  /** Checks whether an element is expanded. */
  isExpanded(element: PeriodicElement) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: PeriodicElement) {
    console.log(  JSON.stringify(element))
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}
