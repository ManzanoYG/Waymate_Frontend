import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "./booking.service";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoInputDriver} from "./dtos/dto-input-driver";
import {DtoInputCar} from "./dtos/dto-input-car";
import {DtoOutputCreateBooking} from "./dtos/dto-output-create-booking";
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  tripId: number = 0;
  trip!: DtoInputTrip;
  addressDepart!: DtoInputAddress;
  addressDestination!: DtoInputAddress;
  driver!: DtoInputDriver;
  car!: DtoInputCar;
  booking!: DtoOutputCreateBooking;
  idPass!: number;

  constructor(private _route: ActivatedRoute, private _bookingService: BookingService, private _router: Router, private _athenticationService: AuthenticationService, private _dialog: MatDialog) {
  }

  ngOnInit() {
    this._athenticationService.isConnected().subscribe({
      next: () => {
        this._route.paramMap.subscribe(params => {
          this.tripId = parseInt(<string>params.get('id'), 10);
          this.getTripById(this.tripId);
        });
      }, error: () => {
        this._dialog.open(PopupNotConnectedComponent);
        this._router.navigate(['/home']);
      }
    });

  }

  getTripById(id:number){
    this._bookingService.getAllTrip(id).subscribe(
      (response: DtoInputTrip) => { // Assuming DtoOutputTrip is the correct type
        this.trip = response as DtoInputTrip;
        this.getAddressById(this.trip.idStartingPoint,this.trip.idDestination);
        this.getDriverById(this.trip.idDriver);
      },
      error => {
        console.error('Error fetching trip details:', error);
      }
    );
  }

  getAddressById(idDepart:number, idDest:number) {
    this._bookingService.getAllAddress(idDepart).subscribe(
      response => {
        this.addressDepart = response;
      },
      error => {
        console.error('Error fetching addressDep details:', error);
      }
    );
    this._bookingService.getAllAddress(idDest).subscribe(
      response => {
        this.addressDestination = response;
      },
      error => {
        console.error('Error fetching addressDest details:', error);
      }
    );
  }

  getDriverById(idDriver:number){
    this._bookingService.getAllDriver(idDriver).subscribe(
      response => {
        this.driver = response;
        this.getCar(this.driver.carPlate);
      },
      error => {
        console.error('Error fetching driver details:', error);
      }
    );
  }

  getCar(carplate:string){
    this._bookingService.getAllCar(carplate).subscribe(
      response => {
        this.car = response;
      },
      error => {
        console.error('Error fetching car details:', error);
      }
    );
  }

  confirmBooking(){
    this._athenticationService.GetUsernameFromToken().subscribe(
      reponse => {
        this._bookingService.getUserB(reponse.username).subscribe(
          reponse => {
            this.booking = {
              date: new Date(),
              reservedSeats: 1,
              IdPassenger: reponse.id,
              IdTrip: this.trip.id
            }
            this._bookingService.createBooking(this.booking).subscribe(
              () => {
                this._router.navigate(['/home']);
              },
              () => {
              }
            );
          }
        )
      }
    )
  }
}
