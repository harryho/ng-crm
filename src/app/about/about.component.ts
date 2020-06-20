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
  selector: "about",
  styles: [
    newLocal
  ],
  template: `
    <div class="about-card">
      <p class="subheader">
        NG CRM 2.0
      </p>
      <p class="content">
        This demo app is not a real application. There is no back-end service behind the scene. Any data update (create or update record) will not be stored after hard refresh or logout. The main purpose of this demo is just a proof of concept.
      </p>
    </div>

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
