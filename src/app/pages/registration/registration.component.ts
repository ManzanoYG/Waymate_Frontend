import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegistrationService} from "./registration.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  errorMail: boolean = false;
  errorUsername: boolean = false;
  maxBirthdate: string;


  form: FormGroup = this._fb.group({
    passengerForm:this._fb.group({
      phoneNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[a-zA-Z0-9_-]{5,20}$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
      passwordVerif: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9]+(?:.[a-z0-9]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]],
      birthdate: ['', [Validators.required]],
      addressId: [0],
      isBanned: [false]
    }),
    addressForm:this._fb.group({
      street:['', [Validators.required]],
      postalCode:['', [Validators.required]],
      city:['', [Validators.required]],
      number: ['', [Validators.required]],
      country:['', [Validators.required]]
    })
  });

  constructor(private _fb: FormBuilder, private _registrationService: RegistrationService, private _route:Router) {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear() - 14, currentDate.getMonth(), currentDate.getDate());
    this.maxBirthdate = maxDate.toISOString().split('T')[0];
  }
  onSubmit(){

    if(this.form.valid){
      const userEmail = this.form.get('passengerForm.email')?.value;
      const userUsername = this.form.get('passengerForm.username')?.value;
      const addressData = this.form.get('addressForm')?.value;
      let registrationData = this.form.get('passengerForm')?.value;
      this._registrationService.fetchByEmail(userEmail).subscribe(
        (response) => {
          if (response.isInDb) {
            this.errorMail = true;
          }
          else {
            this.errorMail = false;
            this._registrationService.fetchByUsername(userUsername).subscribe(
              response => {
                if (response.isInDb) {
                  this.errorUsername = true;
                }
                else {
                  this.errorUsername = false;
                  if(this.verifPassword()) {
                    this._registrationService.fetchByAddress(this.form.get('addressForm.street')?.value,
                      this.form.get('addressForm.postalCode')?.value,
                      this.form.get('addressForm.city')?.value,
                      this.form.get('addressForm.number')?.value,
                      this.form.get('addressForm.country')?.value).subscribe(
                      (id) => {
                        if(id.id !=0 && id.id != null){
                          registrationData.addressId = id.id;
                          this._registrationService.registerUser(registrationData).subscribe(
                            (response) => {
                            }
                          )
                        }
                        else{
                          this._registrationService.insertAddress(addressData).subscribe(
                            (addressId) => {
                              if(addressId.id !=0 && addressId.id != null)
                              registrationData.addressId = addressId.id;
                              this._registrationService.registerUser(registrationData).subscribe(
                                (response) => {
                                }
                              )
                            }
                          )
                        }
                        this._route.navigate(['/home']);
                      }
                    )
                  }
                }
              }
            );
          }
        }
      );

    }
  }

  public controlUsername() : boolean {
    if(this.form.get('passengerForm.username')?.valid && this.form.get('passengerForm.username')?.touched){
      return true;
    }
    else if(this.form.get('passengerForm.username')?.invalid && this.form.get('passengerForm.username')?.touched && this.form.get('passengerForm.username')?.dirty){
      return false;
    }
    return true;
  }

  public controlPassword() : boolean {
    if(this.form.get('passengerForm.password')?.valid && this.form.get('passengerForm.password')?.touched){
      return true;
    }
    else if(this.form.get('passengerForm.password')?.invalid && this.form.get('passengerForm.password')?.touched && this.form.get('passengerForm.password')?.dirty){
      return false;
    }
    return true;
  }
  public controlEmail() : boolean {
    if(this.form.get('passengerForm.email')?.valid && this.form.get('passengerForm.email')?.touched){
      return true;
    }
    else if(this.form.get('passengerForm.email')?.invalid && this.form.get('passengerForm.email')?.touched && this.form.get('passengerForm.email')?.dirty){
      return false;
    }
    return true;
  }

  public verifPassword(): boolean {
    return this.form.get('passengerForm.password')?.value == this.form.get('passengerForm.passwordVerif')?.value;
  }

  clickLogIn() {
    this._route.navigate(['/connection']);
  }
}
