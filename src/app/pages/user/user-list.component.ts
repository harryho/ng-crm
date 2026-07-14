import { Component, inject, resource, signal, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { User } from '../../models/domain/user';
import { UserService } from '../../services/user.service';

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
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
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
export class UserListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userService = inject(UserService);
  pageTitle: string = 'Users';
  AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/300?img=0';
  imageWidth: number = 30;
  imageMargin: number = 2;

  query = signal('');
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  dataSource = signal(new MatTableDataSource([] as User[]));

  displayedColumns = ['avatar', 'firstname', 'lastname', 'email', 'membership', 'id'];
  users = resource<User[], { query: string }>({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      const filteredList = await firstValueFrom(this.userService.filter(params.query));
      const ds = new MatTableDataSource(filteredList as User[]);
      ds.paginator = this.paginator;
      ds.sort = this.sort;
      this.dataSource.set(ds);
      return filteredList;
    },
  });

  reload() {
    this.query.set('');
    this.users.reload();
  }

  getAvatar(user: User) {
    return user.avatarUrl ? user.avatarUrl : this.AVATAR_PLACEHOLDER;
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
        this.userService.delete(id).subscribe(() => {
          this.openSnackBar('The user has been deleted successfully.', 'Close');
          this.users.reload();
        });
      }
    });
  }
}