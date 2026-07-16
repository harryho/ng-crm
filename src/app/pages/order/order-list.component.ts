import { Component, inject, resource, signal, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Order } from '../../models/domain/order';
import { OrderService } from '../../services/order.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCell, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmDialog } from '../../shared/dialog.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatMiniFabButton, MatIconButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
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
    MatIconButton,
    MatMenu,
    MatButtonModule,
    MatProgressBar,
    MatTableModule,
    MatCell,
  ],
})
export class OrderListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  service = inject(OrderService);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  pageTitle: string = 'Order';

  query = signal('');
  dataSource = signal(new MatTableDataSource([] as Order[]));

  expandedElement: Order | null;

  displayedColumns = ['expand', 'reference', 'total', 'userId', 'orderDate', 'shippedDate', 'status', 'id'];

  isExpanded(element: Order) {
    return this.expandedElement === element;
  }

  toggle(element: Order) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  orders = resource<Order[], { query: string }>({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      const all = await firstValueFrom(this.service.list());
      const q = (params.query ?? '').trim().toLowerCase();
      const filtered = q
        ? all.filter((o) => o.reference.toLowerCase().includes(q))
        : all;
      const ds = new MatTableDataSource(filtered as Order[]);
      ds.paginator = this.paginator;
      ds.sort = this.sort;
      this.dataSource.set(ds);
      return filtered;
    },
  });

  reload() {
    this.query.set('');
    this.orders.reload();
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
          this.openSnackBar('The order has been deleted successfully.', 'Close');
          this.orders.reload();
        });
      }
    });
  }

  statusLabel(status: string): string {
    return status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}