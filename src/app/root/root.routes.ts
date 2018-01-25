import { AboutComponent } from "../about";
import { RootComponent } from "./root.component";
// import { HomeComponent } from './home.component';
import { DashboardComponent } from "../dashboard";
import { ProductListComponent } from "../product";
import { CustomerListComponent } from "../customer";
import { OrderListComponent } from "../order";
import { AuthGuard } from "../_guard";
import { NotFoundPageComponent } from "../notfoundpage";

export const routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "about",
        component: AboutComponent
      },
      {
        path: "customer",
        component: CustomerListComponent
      },
      {
        path: "order",
        component: OrderListComponent
      },
      {
        path: "product",
        component: ProductListComponent
      }
    ]
  }
];
