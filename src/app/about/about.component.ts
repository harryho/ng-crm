import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { MatCard } from "@angular/material/card";

@Component({
  selector: "about",
  styles: [
    `
  `
  ],
  template: `
  <mat-card>
    <h1>About</h1>
    <div>
      <h3>
        Reeteek Angular MD App Version 1.0.0
      </h3>
    </div>
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
