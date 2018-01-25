import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule, BrowserXhr } from "@angular/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe } from "@angular/common";

import { NgProgressModule } from "@ngx-progressbar/core";
import { NgProgressHttpModule } from "@ngx-progressbar/http";

import { NgModule, ApplicationRef } from "@angular/core";
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from "@angularclass/hmr";
import { RouterModule, PreloadAllModules } from "@angular/router";

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from "./environment";
import { ROUTES } from "./app.routes";

// App is our top level component
import { AppComponent } from "./app.component";
import { APP_RESOLVER_PROVIDERS } from "./app.resolver";
import { AppState, InternalStateType } from "./app.service";

import { AboutComponent } from "./about";
import { NotFoundPageComponent } from "./notfoundpage";
import { LoginComponent } from "./login";

import { RootComponent } from "./root";
import { DashboardComponent } from "./dashboard";
import { ConfirmDialog } from "./shared";

import { ChartsModule } from "ng2-charts";
import { RootModule } from "./root";
import { CustomerModule } from "./customer";
import { OrderModule } from "./order";
import { ProductModule } from "./product";

// Providers
import { AppPreloader } from "./app.preloader";
import { AuthGuard } from "./_guard";
import {
  BackendService,
  AuthenticationService,
  PagerService
} from "./_services";

import "../styles/headings.css";
import "../styles/styles.scss";

import { MaterialModule } from "./shared";

// Application wide providers
const APP_PROVIDERS = [...APP_RESOLVER_PROVIDERS, AppState];

type StoreType = {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
};

/**
 * `AppModule` is the main entry point into Angular's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AboutComponent,
    NotFoundPageComponent,
    LoginComponent,
    RootComponent,
    DashboardComponent,
    ConfirmDialog
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),
    CustomerModule,
    OrderModule,
    ProductModule,
    RootModule
  ],
  entryComponents: [ConfirmDialog],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    AuthGuard,
    AppPreloader,
    BackendService,
    AuthenticationService,
    PagerService,
    // { provide: BrowserXhr, useClass: NgProgressBrowserXhr } ,
    ENV_PROVIDERS,
    APP_PROVIDERS
  ],
  exports: [MaterialModule]
})
export class AppModule {
  constructor(
    public appRef: ApplicationRef,
    public appState: AppState // private progress: NgProgressService
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log("HMR store", JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ("restoreInputValues" in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(
      cmp => cmp.location.nativeElement
    );
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

  // ngAfterContentInit(){

  //  this.progress.start();
  //  setTimeout(()=>{
  //    this.progress.done();
  //  }, 2000);
  // }
}
