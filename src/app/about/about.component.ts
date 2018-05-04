import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { MatCard } from "@angular/material/card";

const newLocal: string = `
    .about-card {
      display: grid;
      justify-content: center;
      text-align: center;
    }
  `;

@Component({
  selector: "about",
  styles: [
    newLocal
  ],
  template: `
  <mat-card class="about-card">

  <mat-card-title>
    <h1>About</h1>
    </mat-card-title>
    <mat-card-content>
    <div>
      <h3>
        Angular MD App Version 1.0.5
      </h3>
    </div>
    </mat-card-content>
  </mat-card>
  `
})
export class AboutComponent implements OnInit {
  public localState: any;
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
