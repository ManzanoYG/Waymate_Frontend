import {booleanAttribute, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MyTripService} from "../my-trip.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DtoInputTrip} from "../dtos/dto-input-trip";
import {DtoInputAddress} from "../dtos/dto-input-address";

@Component({
  selector: 'app-my-trip-details',
  templateUrl: './my-trip-details.component.html',
  styleUrls: ['./my-trip-details.component.css']
})
export class MyTripDetailsComponent implements OnInit{
  tripId: number = 0;
  addressDepart!: DtoInputAddress;
  addressDestination!: DtoInputAddress;
  trip!: DtoInputTrip;

  constructor(private _fb: FormBuilder, private _route: ActivatedRoute, private _myTripService: MyTripService, private _router:Router) {
  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.tripId = parseInt(<string>params.get('id'), 10);
      this.getTripById(this.tripId);
    });
  }

  form:FormGroup = this._fb.group({
    smoke:['', [Validators.required]],
    petFriendly:['', [Validators.required]],
    luggage:['', [Validators.required]],
    airConditioning:['', [Validators.required]],
    driverMessage:['',[Validators.required]]
  })

  getTripById(id:number){
    this._myTripService.getTrip(id).subscribe(
      (response: DtoInputTrip) => { // Assuming DtoOutputTrip is the correct type
        this.trip = response as DtoInputTrip;
        this.getAddressById(this.trip.idStartingPoint,this.trip.idDestination);
        this.setFormValue();
      },
      error => {
        console.error('Error fetching trip details:', error);
      }
    );
  }

  getAddressById(idDepart:number, idDest:number) {
    this._myTripService.getAddress(idDepart).subscribe(
      response => {
        this.addressDepart = response;
      },
      error => {
        console.error('Error fetching addressDep details:', error);
      }
    );
    this._myTripService.getAddress(idDest).subscribe(
      response => {
        this.addressDestination = response;
      },
      error => {
        console.error('Error fetching addressDest details:', error);
      }
    );
  }

  setFormValue(){
    this.form.setValue(
      {
        smoke:this.trip.smoke,
        petFriendly:this.trip.petFriendly,
        luggage:this.trip.luggage,
        airConditioning:this.trip.airConditioning,
        driverMessage:this.trip.driverMessage
      }
    )
  }

  previousPage(){
    this._router.navigate(['/myTrip']);
  }

  onSubmit(){
    this.trip.smoke = booleanAttribute(this.form.get('smoke')?.value);
    this.trip.petFriendly = booleanAttribute(this.form.get('petFriendly')?.value);
    this.trip.luggage = booleanAttribute(this.form.get('luggage')?.value);
    this.trip.airConditioning = booleanAttribute(this.form.get('airConditioning')?.value);
    this.trip.driverMessage = this.form.get('driverMessage')?.value;

    this._myTripService.updateTrip(this.trip).subscribe(
      response =>{
        this.getTripById(this.tripId);
      }
    );

  }
}
