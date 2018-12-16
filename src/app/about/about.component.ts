import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { MatCard } from "@angular/material/card";

const newLocal: string = `
    .title {
      font-weight:bold;
      font-size: 24px;
    }
    .about-card {
      display: grid;
      justify-content: center;
      text-align: center;
    }
    .subheader{
      font-size: 22px;
      color:darkcyan;
    }
    .content {
      font-size: 18px;
      text-align: left;
    }
  `;

@Component({
  selector: "about",
  styles: [
    newLocal
  ],
  template: `
  <mat-card >

  <mat-card-title>
            </mat-card-title>
    <mat-card-content class="about-card">
    <div>
      <h3 class="title" >About</h3>
      <p class="subheader">
        Angular MD App Demo
      </p>
      <p class="content">
        This demo app is not a real application. There is no fake API as back-end service behind the scene. Its advanced search doesn't work properly. Any data update (create or update record) will not be stored after hard refresh or logout. The main purpose of this demo is just a proof of concept.
      </p>
    </div>
    </mat-card-content>
  </mat-card>
  `
})
export class AboutComponent implements OnInit {
  public localState: any;
  pageTitle: string = "About";

  constructor(public route: ActivatedRoute) { }

  public ngOnInit() {
    this.route.data.subscribe((data: any) => {
      /**
       * Your resolved data from route.
       */
      this.localState = data.yourData;
    });

  }

}
