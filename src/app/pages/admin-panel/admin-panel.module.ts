import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {AdminPanelUserComponent} from "./admin-panel-user/admin-panel-user.component";
import {AdminPanelAddressComponent} from "./admin-panel-address/admin-panel-address.component";
import {RouterLink, RouterModule} from "@angular/router";
import {AdminPanelRoutingModule} from "./admin-panel-routing.module";
import { AdminPanelCarComponent } from './admin-panel-car/admin-panel-car.component';
import { AdminPanelTripComponent } from './admin-panel-trip/admin-panel-trip.component';
import { AdminPanelBookingComponent } from './admin-panel-booking/admin-panel-booking.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSortModule} from "@angular/material/sort";




@NgModule({
  declarations: [
    AdminPanelUserComponent,
    AdminPanelAddressComponent,
    AdminPanelCarComponent,
    AdminPanelTripComponent,
    AdminPanelBookingComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        RouterLink,
        AdminPanelRoutingModule,
        MatPaginatorModule,
        MatTableModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatSortModule
    ]
})
export class AdminPanelModule { }
