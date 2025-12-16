import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {NavbarComponent} from "./addon/navbar/navbar.component";
import {RegistrationComponent} from "./pages/registration/registration.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { ConnectionComponent } from './pages/connection/connection.component';
import { PagesComponent } from './pages/pages.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripSearchComponent } from './pages/trip-search/trip-search.component';
import { FooterComponent } from './addon/footer/footer.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DatePipe } from '@angular/common';
import { MatDialogModule} from "@angular/material/dialog";
import { PopupNotConnectedComponent } from './addon/popup/popup-not-connected/popup-not-connected.component';
import {MatButtonModule} from "@angular/material/button";
import {ProfileComponent} from "./pages/profile/profile.component";
import {AdminProfileComponent} from "./pages/profile/admin-profile/admin-profile.component";
import {PassengerProfileComponent} from "./pages/profile/passenger-profile/passenger-profile.component";
import {DriverProfileComponent} from "./pages/profile/driver-profile/driver-profile.component";
import {BookingComponent} from "./pages/booking/booking.component";
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { MyTripComponent } from './pages/my-trip/my-trip.component';
import { MyTripDetailsComponent } from './pages/my-trip/my-trip-details/my-trip-details.component';
import { MyBookingComponent } from './pages/my-booking/my-booking.component';
import { PopupNotHavePermissionComponent } from './addon/popup/popup-not-have-permission/popup-not-have-permission.component';
import { CreateTripComponent } from './pages/create-trip/create-trip.component';

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    HomePageComponent,
    AppComponent,
    NavbarComponent,
    RegistrationComponent,
    PagesComponent,
    ConnectionComponent,
    TripSearchComponent,
    FooterComponent,
    NotFoundComponent,
    PopupNotConnectedComponent,
    ProfileComponent,
    PassengerProfileComponent,
    AdminProfileComponent,
    DriverProfileComponent,
    BookingComponent,
    AdminPanelComponent,
    MyTripComponent,
    MyTripDetailsComponent,
    MyBookingComponent,
    PopupNotHavePermissionComponent,
    MyBookingComponent,
    CreateTripComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    AppRoutingModule,
    NgbModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbCarouselModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
