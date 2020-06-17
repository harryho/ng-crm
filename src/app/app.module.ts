import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormComponent } from './form/form.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login';
import { AuthenticationService, BackendService, PagerService } from './_services';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard';
import { ChartsModule } from "ng2-charts";  
import { AboutComponent } from './about';
import { NotFoundPageComponent } from './notfoundpage';
import { CustomerModule } from './customer';
import { ConfirmDialog } from './shared/dialog.component';
import { ProductModule } from './product';
import { OrderModule } from './order';
import { AuthGuard } from './_guard';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    LoginComponent,
    DashboardComponent,
    AboutComponent,
    NotFoundPageComponent,
    ConfirmDialog,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ChartsModule,
    // CustomerModule,
    // ProductModule,
    // OrderModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    BackendService,
    AuthenticationService,
    PagerService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
