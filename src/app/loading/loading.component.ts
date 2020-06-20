import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { MatCard } from "@angular/material/card";

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
    selector: "loading",
    styles: [
        newLocal
    ],
    template: `
    <div class="loading-card">
        <mat-spinner></mat-spinner>
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
          ()=>this.router.navigate(['dashboard']), 300
        )
    }
}
