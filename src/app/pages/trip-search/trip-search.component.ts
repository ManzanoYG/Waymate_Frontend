import {Component, OnInit} from '@angular/core';
import {DataTransferService} from "../../utils/data-transfer/data-transfer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TripSearchService} from "./trip-search.service";
import {DatePipe} from "@angular/common";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoInputDriver} from "./dtos/dto-input-driver";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-trip-search',
  templateUrl: './trip-search.component.html',
  styleUrls: ['./trip-search.component.css']
})
export class TripSearchComponent implements OnInit {
  groupedTrips: any[] = [];
  filteredTrips: any[] = [];
  formData: any = [];
  minDate: string;

  constructor(private _tripSearch: TripSearchService, private _fb: FormBuilder, private _sharedDataService: DataTransferService,
              private _datePipe: DatePipe, private _dialog: MatDialog, private authService: AuthenticationService, private _router: Router) {
    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0];
  }

  form: FormGroup = this._fb.group({
    depart: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    date: ['', [Validators.required]],
    people: ['', [Validators.required, Validators.pattern("^\\d+$")]],
  });

  ngOnInit() {
    this.authService.isConnected().subscribe({
      next: () => {
        this._sharedDataService.formData$.subscribe(formData => {
          this.formData = formData;
        });
        this.getAllTripDetails();
        this.formSetValue();
      },
      error: (err) =>{
        console.error("error", err);
        this.openPopup();
        this._router.navigate(['/home']);
      }
    });
  }
  getAllTripDetails() {
    this._tripSearch.getAllTripDetails().subscribe(data => {
      this.groupedTrips = this.groupTrips(data.trips, data.addresses, data.drivers);
      this.groupedTrips.sort((a, b) => new Date(a.trip.date).getTime() - new Date(b.trip.date).getTime());
      this.filterTrips();
    });

  }
  private groupTrips(trips: DtoInputTrip[], addresses: DtoInputAddress[], drivers: DtoInputDriver[]): any[] {
    return trips.map(trip => {
      return {
        trip: trip,
        departureAddress: addresses.find(addr => addr.id === trip.idStartingPoint),
        destinationAddress: addresses.find(addr => addr.id === trip.idDestination),
        driver: drivers.find(driver => driver.id === trip.idDriver)
      };
    });
  }
  filterTrips() {
    this.filteredTrips = this.groupedTrips.filter(trip =>
      trip.departureAddress.city === this.formData.depart &&
      trip.destinationAddress.city === this.formData.destination &&
      this.isSameDate(new Date(trip.trip.date), new Date(this.formData.date))
    );
  }
  isSameDate(date1:Date, date2:Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  formSubmit(){
    this.formData = this.form.value;
    this.getAllTripDetails();
  }

  formSetValue(){
    this.form.setValue({
      depart: this.formData.depart,
      destination: this.formData.destination,
      date: this.formData.date,
      people: this.formData.people,

    });
  }

  openPopup(){
    this._dialog.open(PopupNotConnectedComponent);
  }

  navigateToTripDetails(tripId: number) {
    // Use the router to navigate to the details page with the tripId as a route parameter
    this._router.navigate(['/booking', tripId]);
  }
}
