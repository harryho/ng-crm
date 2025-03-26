import { Component } from "@angular/core";

@Component({
  selector: "not-found-page",
  template: `


    <div class="blank-layout-container justify-content-center" style="height: unset">
      <div class="row">
        <div class="col-12 text-center m-t-0">
          <img src="/assets/images/backgrounds/coming-soon.webp" 
          style="width:600px" alt="coming soon">
          <h2 class="auth-title f-w-600">WIP. It won't be too long.</h2>
          <h6 class="f-s-20 f-w-600 m-b-60"> &nbsp;
           </h6>
            <a mat-flat-button="" 
            
            mat-ripple-loader-class-name="mat-mdc-button-ripple"
             class="mdc-button mdc-button--unelevated mat-mdc-unelevated-button mat-unthemed mat-mdc-button-base" 
             href="/">
              <span class="mat-mdc-button-persistent-ripple mdc-button__ripple">

              </span><span class="mdc-button__label">Go back to Home</span>
              <span class="mat-focus-indicator"></span>
              <span class="mat-mdc-button-touch-target"></span>
              <span class="mat-ripple mat-mdc-button-ripple"></span>
            </a>
            </div>
          </div>
          </div>
              
  `
})
export class ComingSoonComponent { }
