import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';



@Component({
    selector: 'confirm-dialog',
    template: `
<div class="confirm-dialog">
  <h2 mat-dialog-title>Confirm Dialog</h2>
  <mat-dialog-content class="m-b-5">
    Would you like to delete the data?
  </mat-dialog-content>
  <mat-dialog-actions class="m-t-5 b-t-0">
    <button mat-stroked-button [mat-dialog-close]="ACTION_CONFIRM" class="accent">Confirm</button>
    <button mat-flat-button [mat-dialog-close]="ACTION_CANCEL" class="pimary">Cancel</button>
  </mat-dialog-actions>
</div>
        `
    ,
    styles: [
        `
     
        `
    ],
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ConfirmDialog {
    public readonly ACTION_CANCEL: string = "CANCELED";
    public readonly ACTION_CONFIRM: string = "CONFIRMED";

    readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
}
