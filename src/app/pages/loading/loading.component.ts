import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { MatCard } from "@angular/material/card";
import { MatProgressSpinner, MatSpinner } from "@angular/material/progress-spinner";
import { MatProgressBar } from "@angular/material/progress-bar";

const newLocal: string = `
    .title {
      font-weight:bold;
      font-size: 24px;
    }
    .loading-card {
    margin: 0 auto;
    position: relative;

      display: grid;
      justify-content: center;
      text-align: center;
    }
    .subheader{
      font-size: 46px;
      color:darkcyan;
      padding-top: 50px;
      padding-bottom: 50px
    }
    .content {
      padding: 26px;
      font-size: 18px;
      text-align: left;
      line-height: 2em;
    }
  `;

@Component({
    selector: "loading-card",
    styles: [
        newLocal
    ],
    imports:[MatProgressSpinner],
    template: `
    <div class="loading-card">
        <mat-progress-spinner></mat-progress-spinner>
    </div>
  `
})
export class LoadingComponent implements OnInit {
    public localState: any;
    pageTitle: string = "Loading";

    constructor(// public route: ActivatedRoute,
      private router: Router) { }

    public ngOnInit() {
        // this.route.data.subscribe((data: any) => {
        //     /**
        //      * Your resolved data from route.
        //      */
        //     this.localState = data.yourData;
        // });

        setTimeout( 
          ()=>this.router.navigate(['dashboard']), 400
        )
    }
}
