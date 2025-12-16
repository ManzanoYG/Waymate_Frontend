import { NgModule } from '@angular/core';
import {AdminPanelUserComponent} from "./admin-panel-user/admin-panel-user.component";
import {AdminPanelAddressComponent} from "./admin-panel-address/admin-panel-address.component";
import {RouterModule, Routes} from "@angular/router";
import {AdminPanelCarComponent} from "./admin-panel-car/admin-panel-car.component";
import {AdminPanelTripComponent} from "./admin-panel-trip/admin-panel-trip.component";
import {AdminPanelBookingComponent} from "./admin-panel-booking/admin-panel-booking.component";


const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo:"admin-users"},
  {path: "admin-users", component: AdminPanelUserComponent},
  {path: "admin-address", component: AdminPanelAddressComponent},
  {path: "admin-car", component: AdminPanelCarComponent},
  {path: "admin-trip", component: AdminPanelTripComponent},
  {path: "admin-booking", component: AdminPanelBookingComponent},
  ];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
