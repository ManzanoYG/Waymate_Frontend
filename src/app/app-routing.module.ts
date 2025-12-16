import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AdminPanelComponent} from "./pages/admin-panel/admin-panel.component";
import {RegistrationComponent} from "./pages/registration/registration.component";
import {ConnectionComponent} from "./pages/connection/connection.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {TripSearchComponent} from "./pages/trip-search/trip-search.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {BookingComponent} from "./pages/booking/booking.component";
import {MyTripComponent} from "./pages/my-trip/my-trip.component";
import {MyTripDetailsComponent} from "./pages/my-trip/my-trip-details/my-trip-details.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {MyBookingComponent} from "./pages/my-booking/my-booking.component";
import {CreateTripComponent} from "./pages/create-trip/create-trip.component";

const routes: Routes = [
  {path: "home", component: HomePageComponent},
  {path: "", pathMatch: "full", redirectTo:"/home"},
  {
    path: "adminPanel",
    component: AdminPanelComponent,
    loadChildren: () => import('./pages/admin-panel/admin-panel.module').then(a => a.AdminPanelModule)
  },
  {path: "myBooking", component: MyBookingComponent},
  {path: "tripSearch", component: TripSearchComponent},
  {path: "booking/:id", component: BookingComponent},
  {path: "trip/:id", component: MyTripDetailsComponent},
  {path: "myTrip", component: MyTripComponent},
  {path: "createTrip", component: CreateTripComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "connection", component: ConnectionComponent},
  {path: "profile", component: ProfileComponent},
  {path: "not-found", component: NotFoundComponent},
  {path: "**", redirectTo:"/not-found"}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
