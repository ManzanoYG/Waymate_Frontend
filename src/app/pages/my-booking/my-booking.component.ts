import {Component, OnInit} from '@angular/core';
import {MyBookingService} from "./my-booking.service";
import {DtoInputBooking} from "./dtos/dto-input-booking";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoInputDriver} from "./dtos/dto-input-driver";
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {DtoOutputUser} from "../my-trip/dtos/dto-output-user";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {
  user!:DtoOutputUser;
  groupedBooking: any[] = [];
  filteredBooking: any[] = [];

  constructor(private _authService: AuthenticationService, private _myBookingService: MyBookingService, private _dialog: MatDialog, private _router: Router) {
  }


  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: () => {
        this.getUsernameToken();
      }, error: () => {
        this._dialog.open(PopupNotConnectedComponent);
        this._router.navigate(['/home']);
    }
  });
  }

  getUsernameToken(){
    this._authService.GetUsernameFromToken().subscribe(
      value => {
        this._myBookingService.getUserFromUsername(value.username).subscribe(
          value => {
            this.user = value;
            this.getAllBookingDetails();
          });
      }
    );
  }

  getAllBookingDetails() {
    this._myBookingService.getAllBookingDetails().subscribe(data => {
      this.groupedBooking = this.groupBooking(data.bookings, data.trips, data.addresses, data.drivers);
      this.groupedBooking.sort((a, b) => new Date(a.booking.date).getTime() - new Date(b.booking.date).getTime());
      this.filterBooking();
    })
  }

  private groupBooking(bookings: DtoInputBooking[], trips: DtoInputTrip[], addresses: DtoInputAddress[], drivers: DtoInputDriver[]): any {
    return bookings.map((booking) => {
      const trip = trips.find((tr) => tr.id === booking.idTrip);
      return {
        booking: booking,
        trip: trip,
        departureAddress: addresses.find(
          (addr) => addr.id === trip?.idStartingPoint
        ),
        destinationAddress: addresses.find(
          (addr) => addr.id === trip?.idDestination
        ),
        driver: drivers.find((driver) => driver.id === trip?.idDriver)
      };
    });
  }

  filterBooking() {
    this.filteredBooking = this.groupedBooking.filter(booking =>
      booking.booking.idPassenger === this.user.id &&
      booking.booking.idTrip === booking.trip.id &&
      booking.trip.idStartingPoint == booking.departureAddress.id &&
      booking.trip.idDestination == booking.destinationAddress.id
    );
  }
}
