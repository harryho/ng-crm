import { Component, inject, resource, signal, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Staff } from '../../models/domain/staff';
import { StaffService } from '../../services/staff.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ConfirmDialog } from '../../shared/dialog.component';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css'],
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
  ],
})
export class StaffListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  staffService = inject(StaffService);
  pageTitle: string = 'Staff';
  AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/300?img=0';
  imageWidth: number = 30;
  imageMargin: number = 2;

  query = signal('');
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  dataSource = signal(new MatTableDataSource([] as Staff[]));

  displayedColumns = [
    'avatar',
    'firstname',
    'lastname',
    'role',
    'company',
    'email',
    'status',
    'isVerified',
    'id',
  ];

  staff = resource<Staff[], { query: string }>({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      const all = await firstValueFrom(this.staffService.list());
      const q = (params.query ?? '').trim().toLowerCase();
      const filtered = q
        ? all.filter((s) =>
            `${s.firstname} ${s.lastname} ${s.email} ${s.company} ${s.role}`
              .toLowerCase()
              .includes(q),
          )
        : all;
      const ds = new MatTableDataSource(filtered as Staff[]);
      ds.paginator = this.paginator;
      ds.sort = this.sort;
      this.dataSource.set(ds);
      return filtered;
    },
  });

  reload() {
    this.query.set('');
    this.staff.reload();
  }

  getAvatar(s: Staff) {
    return s.avatarUrl ? s.avatarUrl : this.AVATAR_PLACEHOLDER;
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
        this.staffService.delete(id).subscribe(() => {
          this.openSnackBar('The staff member has been deleted.', 'Close');
          this.staff.reload();
        });
      }
    });
  }

  roleClass(role: string): string {
    if (role === 'Owner') return 'bg-light-error text-error';
    if (role === 'Sales Leader') return 'bg-light-warning text-warning';
    if (role === 'Sales') return 'bg-light-primary text-primary';
    if (role === 'Engineer') return 'bg-light-success text-success';
    return 'bg-light-secondary text-secondary';
  }

  statusClass(status: string): string {
    if (status === 'active') return 'bg-light-success text-success';
    if (status === 'locked') return 'bg-light-error text-error';
    return 'bg-light-warning text-warning';
  }
}