import { Component, OnInit, ViewChild } from "@angular/core";

import { IOrder } from "./order";
import { OrderService } from "./order.service";
import { PagerService } from "../_services";
import { ConfirmDialog } from "../shared";
import * as _ from "lodash";
import {MatSnackBar} from '@angular/material/snack-bar';

import {MatDialog} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'order-list',
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
  providers: [ConfirmDialog]
})
export class OrderListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pageTitle: string = "Orders";

  showImage: boolean = false;
  listFilter: any = {};
  errorMessage: string;
  orders: IOrder[];
  orderList: IOrder[]; //
  displayedColumns = ["reference", "quantity", "amount", "customerName", "orderDate", "shippedDate", "id"];
  dataSource: any = null; // new MatTableDataSource<Element>(ELEMENT_DATA);
  pager: any = {};
  pagedItems: any[];
  totalAmount: number;
  searchFilter: any = {
    reference: "",
    amount: "",
    quantity: ""

  };
  selectedOption: string;



  constructor(
    private orderService: OrderService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  freshDataList(orders: IOrder[]) {
    this.orders = orders;
    this.orderList = orders.map(e => {
      let order = e;
      e["customerName"] = e.customer.firstname + " " + e.customer.lastname;
      return order;
    });
    this.totalAmount = this.orders.length;
    this.dataSource = new MatTableDataSource(this.orderList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(orders => {
      this.freshDataList(orders);
    }, error => (this.errorMessage = <any>error));

    this.searchFilter = {};
    this.listFilter = {};
  }

  getOrders(pageNum?: number) {
    this.orderService.getOrders().subscribe(orders => {
      this.freshDataList(orders);

    }, error => (this.errorMessage = <any>error));
  }

  searchOrders(filters: any) {
    if (filters) {
      this.orderService.getOrders().subscribe(orders => {
        this.orders = orders;
        console.log(this.orders.length);
        this.orders = this.orders.filter((order: IOrder) => {
          let match = true;

          Object.keys(filters).forEach(k => {
            match =
              match && filters[k]
                ? order[k]
                  .toLocaleLowerCase()
                  .indexOf(filters[k].toLocaleLowerCase()) > -1
                : match;
          })

          this.freshDataList(orders);
          return match;
        });
      }, error => (this.errorMessage = <any>error));
    }
  }

  resetListFilter() {
    this.listFilter = {};
    this.getOrders();
  }

  reset() {
    this.listFilter = {};
    this.searchFilter = {};

    this.getOrders();
  }

  resetSearchFilter(searchPanel: any) {
    searchPanel.toggle();
    this.searchFilter = {};

    this.getOrders();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1500
    });
  }

  openDialog(id: number) {
    let dialogRef = this.dialog.open(ConfirmDialog, {
      data: { title: "Dialog", message: "Are you sure to delete this item?" }
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;

      if (this.selectedOption === dialogRef.componentInstance.ACTION_CONFIRM) {
        this.orderService.deleteOrder(id).subscribe(
          () => {
            this.orderService.getOrders().subscribe(orders => {
              this.freshDataList(orders);
            }, error => (this.errorMessage = <any>error));
            this.openSnackBar("The item has been deleted successfully. ", "Close");
          },
          (error: any) => {
            this.errorMessage = <any>error;
            console.log(this.errorMessage);
            this.openSnackBar(
              "This item has not been deleted successfully. Please try again.",
              "Close"
            );
          }
        );
      }
    });
  }
}
