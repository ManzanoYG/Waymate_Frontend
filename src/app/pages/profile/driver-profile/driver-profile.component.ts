import {Component} from '@angular/core';
import {DtoInputAddress} from "../../trip-search/dtos/dto-input-address";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfileService} from "../profile.service";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {RegistrationService} from "../../registration/registration.service";
import {DtoOutputCreateAddress} from "../../registration/dtos/dto-output-create-address";
import {DtoOutputDriver} from "../dto/dto-output-driver";
import {DtoInputToken} from "../../connection/dto/dto-input-token";
import {DtoOuputCar} from "../dto/dto-ouput-car";

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent {
  _driver!: DtoOutputDriver;
  _address!: DtoInputAddress;
  _car!: DtoOuputCar;
  ImagePath: string;
  editMode: boolean = false;
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
    this.ImagePath = "assets/img/DriverIcon.png";
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear() - 14, currentDate.getMonth(), currentDate.getDate());
    this.maxBirthdate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this._authService.GetUsernameFromToken().subscribe(value => {
      this._profileService.getUserFromUsername(value.username).subscribe(user => {
        this._driver = {
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
          addressId: user.addressId,
          carPlate: user.carPlate
        };
        this._profileService.getAddressById(user.addressId).subscribe(address => {
          this._address = {
            id: this._driver.addressId,
            street: address.street,
            postalCode: address.postalCode,
            city: address.city,
            number: address.number,
            country: address.country
          }
          this._profileService.getCarById(user.carPlate).subscribe(car => {
            this._car = {
              numberPlate: car.numberPlate,
              carType: car.carType,
              fuelType: car.fuelType,
              brand: car.brand,
              model: car.model,
              nbSeats: car.nbSeats,
              color: car.color
            }
            this.form.setValue({
              passengerForm: {
                username: this._driver.username,
                birthDate: new Date(this._driver.birthdate).toISOString().slice(0, 10),
                email: this._driver.email,
                phone: this._driver.phoneNumber,
                lastname: this._driver.lastname,
                firstname: this._driver.firstname,
                gender: this._driver.gender,
                addressId: this._driver.addressId,
              },
              addressForm: {
                street: this._address.street,
                postalCode: this._address.postalCode,
                city: this._address.city,
                number: this._address.number,
                country: this._address.country
              },
              carForm: {
                numberPlate: this._car.numberPlate,
                brand: this._car.brand,
                model: this._car.model,
                nbSeats: this._car.nbSeats,
                fuelType: 0,
                carType: 0,
                color: this._car.color,
              },
            });
          })
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
          if (response.isInDb && newEmail !== this._driver.email) {
            this.errorMail = true;
          } else {
            this.errorMail = false;

            this._registrationService.fetchByUsername(newUsername).subscribe(
              (response) => {
                if (response.isInDb && newUsername !== this._driver.username) {
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
                        this.updateDriverDetails(newUsername, newEmail, idAddress);
                        this.updateDriverAddress(idAddress);
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
                              this.updateDriverDetails(newUsername, newEmail, idAddress);
                              this.updateDriverAddress(idAddress);
                            }
                          }
                        );
                      }
                      this._car = {
                        numberPlate: this._car.numberPlate,
                        brand: this.form.get('carForm.brand')?.value,
                        model: this.form.get('carForm.model')?.value,
                        nbSeats: this.form.get('carForm.nbSeats')?.value,
                        fuelType: parseInt(this.form.get('carForm.fuelType')?.value, 10),
                        carType: parseInt(this.form.get('carForm.carType')?.value, 10),
                        color: this.form.get('carForm.color')?.value,
                      }
                      this._profileService.updateCar(this._car.numberPlate, this._car).subscribe();

                      this.QuitEditMode();
                      this.generateToken();
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  }

  updateDriverDetails(newUsername: string, newEmail: string, idAddress: number) {
    this.updateDriver(
      this._driver.id,
      newUsername,
      this._driver.userType,
      this._driver.password,
      newEmail,
      this.form.get('passengerForm.birthDate')?.value,
      this.form.get('passengerForm.phone')?.value,
      this.form.get('passengerForm.lastname')?.value,
      this.form.get('passengerForm.firstname')?.value,
      this.form.get('passengerForm.gender')?.value,
      idAddress,
      this._driver.carPlate
    );

    // Update passenger data
    this._profileService.updateDriver(this._driver.id, this._driver).subscribe();
  }

  updateDriverAddress(idAddress: number) {
    // Update address
    if (idAddress !== 0) {
      this._profileService.getAddressById(idAddress).subscribe(address => {
        this._address = {
          id: this._driver.addressId,
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
    const dto: DtoInputToken = {username: this._driver.username, usertype: this._driver.userType};
    this._authService.generateToken(dto).subscribe();
  }


  updateDriver(
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
    addressId: number,
    numberPlate: string
  ) {
    this._driver = {
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
      carPlate: numberPlate
    };
  }

  EnterEditMode() {
    this.editMode = true;
  }

  QuitEditMode() {
    this.editMode = false;
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
}
