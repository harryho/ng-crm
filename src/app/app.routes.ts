import { Routes } from "@angular/router";
import { NotFoundPageComponent } from "./notfoundpage";

import { RootComponent } from "./root";
import { AuthGuard } from "./_guard";

export const ROUTES: Routes = [
  { path: "", component: RootComponent, canActivate: [AuthGuard] },
  { path: "root", component: RootComponent },
  { path: "login", component: RootComponent },
  { path: "**", component: NotFoundPageComponent, canActivate: [AuthGuard] }
];
