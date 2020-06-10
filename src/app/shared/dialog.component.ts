import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
    selector: 'confirm-dialog',
    template: `
        <div class="confirm-dialog">
           <h1 class="confirm-dialog-title">{{data && data.title? data.title: 'Dialog'}}</h1>

            <mat-dialog-content class="confirm-dialog-content">
            {{data && data.message? data.message: 'Are you sure to do this?'}}
            </mat-dialog-content>
            <mat-dialog-actions class="confirm-dialog-action">
            <button mat-raised-button [mat-dialog-close]="ACTION_CONFIRM" class="accent" >Confirm</button>
            <button mat-raised-button [mat-dialog-close]="ACTION_CANCEL" class="primary">Cancel</button>
            </mat-dialog-actions>
        </div>`
    ,
    styles: [
        `
        .confirm-dialog {
            min-width: 350px;
            font-family: sans-serif;
            }
        .confirm-dialog-title {
            margin-top:0px;
        }
        .confirm-dialog-content {
            padding-top:10px; 
            padding-bottom:20px;
        }
        .confirm-dialog-action {
            justify-content: center;
        }
        `
    ]

})
export class ConfirmDialog {
    // dialogActions: string;
    public readonly ACTION_YES: string = "YES";
    public readonly ACTION_NO: string = "NO";
    public readonly ACTION_CANCEL: string = "CANCELED";
    public readonly ACTION_IGNORE: string = "IGNORED";
    public readonly ACTION_OK: string = "OK";
    public readonly ACTION_CLOSE: string = "CLOSED";
    public readonly ACTION_CONFIRM: string = "CONFIRMED";

    constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialog>) {


    }
}
