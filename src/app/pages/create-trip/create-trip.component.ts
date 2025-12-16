import {booleanAttribute, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CreateTripService} from "./create-trip.service";
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {DtoOutputUser} from "./dtos/dto-output-user";
import {DtoOutputTrip} from "./dtos/dto-output-trip";
import {DtoOutputAddress} from "./dtos/dto-output-address";
import {MatDialog} from "@angular/material/dialog";
import {
  PopupNotHavePermissionComponent
} from "../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit{
  user!:DtoOutputUser;
  minDate: string;
  trip!: DtoOutputTrip;
  address!: DtoOutputAddress;

  form:FormGroup = this._fb.group({
    trip:this._fb.group({
      dateTrip: ['', [Validators.required]],
      price: ['', [Validators.required]],
      smoke: ['', [Validators.required]],
      petFriendly: ['', [Validators.required]],
      luggage: ['', [Validators.required]],
      airConditioning: ['', [Validators.required]],
      driverMessage: ['', [Validators.required]]
    }),
    addressDepart:this._fb.group({
      street:['', [Validators.required]],
      postalCode:['', [Validators.required]],
      city:['', [Validators.required]],
      number: ['', [Validators.required]],
      country:['', [Validators.required]]
    }),
    addressDest:this._fb.group({
      street:['', [Validators.required]],
      postalCode:['', [Validators.required]],
      city:['', [Validators.required]],
      number: ['', [Validators.required]],
      country:['', [Validators.required]]
    })
  });

  constructor(private _authService: AuthenticationService, private _fb: FormBuilder, private _dialog: MatDialog, private _createTripService: CreateTripService, private _route:Router) {
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1);
    this.minDate = minDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: () => {
        this._authService.TestConnectionDriver().subscribe({
          next: () => {

          }, error: () => {
            this._dialog.open(PopupNotHavePermissionComponent);
            this._route.navigate(['/home']);
          }
        });
      }, error: () => {
        this._dialog.open(PopupNotConnectedComponent);
        this._route.navigate(['/home']);
      }
    });
    this.setFormValue();
    this.getUsernameToken();
  }

  getUsernameToken(){
    this._authService.GetUsernameFromToken().subscribe(
      value => {
        this._createTripService.fetchByUsername(value.username).subscribe(
          value => {
            this.user = value;
          });
      }
    );
  }

  onSubmit(){
    if(this.form.valid) {
      this.address = {
        street:this.form.get('addressDepart.street')?.value,
        postalCode:this.form.get('addressDepart.postalCode')?.value,
        city:this.form.get('addressDepart.city')?.value,
        number:this.form.get('addressDepart.number')?.value,
        country:this.form.get('addressDepart.country')?.value
      }
      this.trip = {
        idDriver: this.user.id,
        smoke: booleanAttribute(this.form.get('trip.smoke')?.value),
        price: this.form.get('trip.price')?.value,
        luggage: booleanAttribute(this.form.get('trip.luggage')?.value),
        petFriendly: booleanAttribute(this.form.get('trip.petFriendly')?.value),
        date: new Date(this.form.get('trip.dateTrip')?.value),
        driverMessage: this.form.get('trip.driverMessage')?.value,
        airConditioning: booleanAttribute(this.form.get('trip.airConditioning')?.value),
        idStartingPoint: 0,
        idDestination: 0
      }
      this._createTripService.fetchByAddress(this.form.get('addressDepart.street')?.value,
        this.form.get('addressDepart.postalCode')?.value,
        this.form.get('addressDepart.city')?.value,
        this.form.get('addressDepart.number')?.value,
        this.form.get('addressDepart.country')?.value).subscribe(
        (id)=>{
          if (id.id != 0 && id.id != null) {
            this.trip.idStartingPoint = id.id;
            this.createTrip();
          }else {
            this._createTripService.insertAddress(this.address).subscribe(
              response => {
                this.trip.idStartingPoint = response.id;
                this.createTrip();
              }
            )
          }
        }
      )

      this._createTripService.fetchByAddress(this.form.get('addressDest.street')?.value,
        this.form.get('addressDest.postalCode')?.value,
        this.form.get('addressDest.city')?.value,
        this.form.get('addressDest.number')?.value,
        this.form.get('addressDest.country')?.value).subscribe(
        (id)=>{
          if (id.id != 0 && id.id != null) {
            this.trip.idDestination = id.id;
            this.createTrip();
          } else {
            this.address.street=this.form.get('addressDest.street')?.value;
            this.address.postalCode=this.form.get('addressDest.postalCode')?.value;
            this.address.city=this.form.get('addressDest.city')?.value;
            this.address.number=this.form.get('addressDest.number')?.value;
            this.address.country=this.form.get('addressDest.country')?.value

            this._createTripService.insertAddress(this.address).subscribe(
              response => {
                this.trip.idDestination = response.id;
                this.createTrip();
              }
            )
          }
        }
      )


    }
  }

  createTrip(){
    if(this.trip.idDestination != 0 && this.trip.idStartingPoint !=0) {
      this._createTripService.insertTrip(this.trip).subscribe(
        (response) => {
          this._route.navigate(['/myTrip']);
        }
      );
    }
  }

  setFormValue() {
    this.form.setValue({
      trip:{
        dateTrip: this.minDate,
        price:"",
        smoke: "true",
        petFriendly:"true",
        luggage:"true",
        airConditioning:"true",
        driverMessage:""
      },
      addressDepart:{
        street:"",
        number:"",
        postalCode:"",
        city:"",
        country:""
      },
      addressDest:{
        street:"",
        number:"",
        postalCode:"",
        city:"",
        country:""
      }
    });
  }
}
