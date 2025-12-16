import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfileService} from "../profile.service";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {RegistrationService} from "../../registration/registration.service";
import {DtoInputToken} from "../../connection/dto/dto-input-token";
import {DtoOutputPassenger} from "../dto/dto-output-passenger";
import {DtoInputAddress} from "../../trip-search/dtos/dto-input-address";
import {DtoOutputCreateAddress} from "../../registration/dtos/dto-output-create-address";
import {DtoOuputCar} from "../dto/dto-ouput-car";
import {DtoOutputDriver} from "../dto/dto-output-driver";

@Component({
  selector: 'app-passenger-profile',
  templateUrl: './passenger-profile.component.html',
  styleUrls: ['./passenger-profile.component.css']
})
export class PassengerProfileComponent {
  _passenger!: DtoOutputPassenger;
  _address!: DtoInputAddress;
  ImagePath: string;
  editMode: boolean = false;
  addCarMode: boolean = false;
  errorMail: boolean = false;
  errorUsername: boolean = false;
  errorPlate: boolean = false;
  maxBirthdate: string;

  form: FormGroup = this._fb.group({
    passengerForm: this._fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[a-zA-Z0-9_-]{5,20}$")]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9]+(?:.[a-z0-9]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]],
      phone: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      addressId: [0],
    }),
    addressForm: this._fb.group({
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      number: ['', [Validators.required]],
      country: ['', [Validators.required]]
    }),
    carForm: this._fb.group({
      numberPlate: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      nbSeats: ['', [Validators.required]],
      fuelType: ['', [Validators.required]],
      carType: ['', [Validators.required]],
      color: ['', [Validators.required]]
    })
  });

  constructor(private _profileService: ProfileService, private _authService: AuthenticationService, private _fb: FormBuilder,
              private _registrationService: RegistrationService) {
    this.ImagePath = "assets/img/PassengerIcon.png";
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear() - 14, currentDate.getMonth(), currentDate.getDate());
    this.maxBirthdate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this._authService.GetUsernameFromToken().subscribe(value => {
      this._profileService.getUserFromUsername(value.username).subscribe(user => {
        this._passenger = {
          id: user.id,
          username: user.username,
          userType: user.userType,
          password: user.password,
          email: user.email,
          birthdate: user.birthdate,
          phoneNumber: user.phoneNumber,
          lastname: user.lastName,
          firstname: user.firstName,
          gender: user.gender,
          addressId: user.addressId
        };
        this._profileService.getAddressById(user.addressId).subscribe(address => {
          this._address = {
            id: this._passenger.addressId,
            street: address.street,
            postalCode: address.postalCode,
            city: address.city,
            number: address.number,
            country: address.country
          }
          this.form.setValue({
            passengerForm: {
              username: this._passenger.username,
              birthDate: new Date(this._passenger.birthdate).toISOString().slice(0, 10),
              email: this._passenger.email,
              phone: this._passenger.phoneNumber,
              lastname: this._passenger.lastname,
              firstname: this._passenger.firstname,
              gender: this._passenger.gender,
              addressId: this._passenger.addressId,
            },
            addressForm: {
              street: this._address.street,
              postalCode: this._address.postalCode,
              city: this._address.city,
              number: this._address.number,
              country: this._address.country
            },
            carForm: {
              numberPlate: 'Number plate',
              brand: 'Brand',
              model: 'Model',
              nbSeats: 2,
              fuelType: 0,
              carType: 0,
              color: 'Blue',
            },
          });
        });
      });
    });

  }

  onSubmit() {
    if (this.form.valid) {
      const newEmail = this.form.get('passengerForm.email')?.value;
      const newUsername = this.form.get('passengerForm.username')?.value;
      const addressData = this.form.get('addressForm')?.value;
      let idAddress: number;

      // Check for duplicate email
      this._registrationService.fetchByEmail(newEmail).subscribe(
        (response) => {
          if (response.isInDb && newEmail !== this._passenger.email) {
            this.errorMail = true;
          } else {
            this.errorMail = false;

            this._registrationService.fetchByUsername(newUsername).subscribe(
              (response) => {
                if (response.isInDb && newUsername !== this._passenger.username) {
                  this.errorUsername = true;
                } else {
                  this.errorUsername = false;
                  this._registrationService.fetchByAddress(
                    addressData.street,
                    addressData.postalCode,
                    addressData.city,
                    addressData.number,
                    addressData.country
                  ).subscribe(
                    (id) => {
                      if (id.id !== 0 && id.id !== null) {
                        idAddress = id.id;
                        this.updatePassengerDetails(newUsername, newEmail, idAddress);
                        this.updatePassengerAddress(idAddress);
                      } else {
                        // New address, insert and update user data
                        const dtoAddress: DtoOutputCreateAddress = {
                          street: addressData.street,
                          postalCode: addressData.postalCode,
                          city: addressData.city,
                          number: addressData.number,
                          country: addressData.country
                        };
                        this._registrationService.insertAddress(dtoAddress).subscribe(
                          (addressId) => {
                            if (addressId.id !== 0 && addressId.id !== null) {
                              idAddress = addressId.id;
                              this.updatePassengerDetails(newUsername, newEmail, idAddress);
                              this.updatePassengerAddress(idAddress);
                            }
                          }
                        );
                      }

                      if (this.addCarMode) {
                        this._profileService.getCarById(this.form.get('carForm.numberPlate')?.value).subscribe(
                          (response) => {
                            this.updateUserType(response.numberPlate);
                          },
                          () => {
                            this.errorPlate = false;
                            this.createCar({
                              numberPlate: this.form.get('carForm.numberPlate')?.value,
                              brand: this.form.get('carForm.brand')?.value,
                              model: this.form.get('carForm.model')?.value,
                              nbSeats: this.form.get('carForm.nbSeats')?.value,
                              fuelType: parseInt(this.form.get('carForm.fuelType')?.value, 10),
                              carType: parseInt(this.form.get('carForm.carType')?.value, 10),
                              color: this.form.get('carForm.color')?.value
                            });
                            this.updateUserType(this.form.get('carForm.numberPlate')?.value);
                          }
                        )
                      }
                      this.QuitEditMode();
                      this.generateToken();
                    }
                  );
                }
              }
            );
          }
        },
        (error) => {
        }
      );
    }
  }

  createCar(dto: DtoOuputCar) {
    this._profileService.createCar(dto).subscribe();
  }

  updateUserType(numberPlate: string){
    let dtoDriver: DtoOutputDriver = {
      id: this._passenger.id,
      username: this._passenger.username,
      userType: this._passenger.userType,
      password: this._passenger.password,
      email: this._passenger.email,
      birthdate: this._passenger.birthdate,
      phoneNumber: this._passenger.phoneNumber,
      lastname: this._passenger.lastname,
      firstname: this._passenger.firstname,
      gender: this._passenger.gender,
      addressId: this._passenger.addressId,
      carPlate: numberPlate
    }
    this._profileService.changerUserType(this._passenger.id).subscribe(
      error=>{
      }
    );
    this._profileService.updateDriver(dtoDriver.id, dtoDriver).subscribe(
      error=>{
      });
  }

  updatePassengerDetails(newUsername: string, newEmail: string, idAddress: number) {
    this.updatePassenger(
      this._passenger.id,
      newUsername,
      this._passenger.userType,
      this._passenger.password,
      newEmail,
      this.form.get('passengerForm.birthDate')?.value,
      this.form.get('passengerForm.phone')?.value,
      this.form.get('passengerForm.lastname')?.value,
      this.form.get('passengerForm.firstname')?.value,
      this.form.get('passengerForm.gender')?.value,
      idAddress
    );

    // Update passenger data
    this._profileService.updatePassenger(this._passenger.id, this._passenger).subscribe();
  }

  updatePassengerAddress(idAddress: number) {
    // Update address
    if (idAddress !== 0) {
      this._profileService.getAddressById(idAddress).subscribe(address => {
        this._address = {
          id: this._passenger.addressId,
          street: address.street,
          postalCode: address.postalCode,
          city: address.city,
          number: address.number,
          country: address.country
        };
      });
    }
  }

  generateToken() {
    // Generate token
    const dto: DtoInputToken = {username: this._passenger.username, usertype: this._passenger.userType};
        this._authService.generateToken(dto).subscribe();
  }


  updatePassenger(
    id: number,
    username: string,
    userType: string,
    password: string,
    email: string,
    birthdate: Date,
    phoneNumber: string,
    lastname: string,
    firstname: string,
    gender: string,
    addressId: number
  ) {
    this._passenger = {
      id: id,
      username: username,
      userType: userType,
      password: password,
      email: email,
      birthdate: birthdate,
      phoneNumber: phoneNumber,
      lastname: lastname,
      firstname: firstname,
      gender: gender,
      addressId: addressId,
    };
  }

  EnterEditMode() {
    this.editMode = true;
  }

  QuitEditMode() {
    this.editMode = false;
    this.QuitAddCarMode();
  }

  EnterAddCarMode() {
    this.addCarMode = true;
  }

  QuitAddCarMode() {
    this.addCarMode = false;
  }

  controlUsername():
    boolean {
    if (this.form.get('passengerForm.username')?.valid && this.form.get('passengerForm.username')?.touched) {
      return true;
    } else if (this.form.get('passengerForm.username')?.invalid && this.form.get('passengerForm.username')?.touched && this.form.get('passengerForm.username')?.dirty) {
      return false;
    }
    return true;
  }

  controlEmail():
    boolean {
    if (this.form.get('passengerForm.email')?.valid && this.form.get('passengerForm.email')?.touched) {
      return true;
    } else if (this.form.get('passengerForm.email')?.invalid && this.form.get('passengerForm.email')?.touched && this.form.get('passengerForm.email')?.dirty) {
      return false;
    }
    return true;
  }

  controlPlate():
    boolean {
    if (this.form.get('carForm.numberPlate')?.valid && this.form.get('carForm.numberPlate')?.touched) {
      return true;
    } else if (this.form.get('carForm.numberPlate')?.invalid && this.form.get('carForm.numberPlate')?.touched && this.form.get('carForm.numberPlate')?.dirty) {
      return false;
    }
    return true;
  }
}
