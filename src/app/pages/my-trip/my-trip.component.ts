import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {MyTripService} from "./my-trip.service";
import {DtoOutputUser} from "./dtos/dto-output-user";
import {DtoInputTrip} from "../trip-search/dtos/dto-input-trip";
import {DtoInputAddress} from "../trip-search/dtos/dto-input-address";
import {Router} from "@angular/router";
import {
  PopupNotHavePermissionComponent
} from "../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-my-trip',
  templateUrl: './my-trip.component.html',
  styleUrls: ['./my-trip.component.css']
})
export class MyTripComponent implements OnInit {
  user!:DtoOutputUser;
  groupedTrips: any[] = [];
  filteredTrips: any[] = [];

  constructor(private _authService: AuthenticationService, private _myTripService: MyTripService, private _router: Router, private _dialog: MatDialog) {
  }

  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: () => {
        this._authService.TestConnectionDriver().subscribe({
          next: () => {
            this.getUsernameToken();
          }, error: () => {
            this._dialog.open(PopupNotHavePermissionComponent);
            this._router.navigate(['/home']);
          }
        });
      }, error: () => {
        this._dialog.open(PopupNotConnectedComponent);
        this._router.navigate(['/home']);
      }
    });
  }

  getUsernameToken(){
    this._authService.GetUsernameFromToken().subscribe(
      value => {
        this._myTripService.getUserFromUsername(value.username).subscribe(
          value => {
            this.user = value;
            this.getAllTripDetails();
          });
      }
    );
  }

  getAllTripDetails() {
    this._myTripService.getAllTripDetails().subscribe(data => {
      this.groupedTrips = this.groupTrips(data.trips, data.addresses);
      this.groupedTrips.sort((a, b) => new Date(a.trip.date).getTime() - new Date(b.trip.date).getTime());
      this.filterTrips();
    });
  }

  filterTrips() {
    this.filteredTrips = this.groupedTrips.filter(trip =>
      trip.trip.idDriver === this.user.id
    );
  }

  private groupTrips(trips: DtoInputTrip[], addresses: DtoInputAddress[]): any[] {
    return trips.map(trip => {
      return {
        trip: trip,
        departureAddress: addresses.find(addr => addr.id === trip.idStartingPoint),
        destinationAddress: addresses.find(addr => addr.id === trip.idDestination),
      };
    });
  }

  modifyTrips(id:number){
    this._router.navigate(['/trip', id]);
  }
}
