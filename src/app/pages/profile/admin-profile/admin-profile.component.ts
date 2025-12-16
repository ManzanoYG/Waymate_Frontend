import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../profile.service";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {DtoOutputAdmin} from "../dto/dto-output-admin";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegistrationService} from "../../registration/registration.service";
import {DtoInputToken} from "../../connection/dto/dto-input-token";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  _admin!: DtoOutputAdmin;
  ImagePath: string;
  editMode: boolean = false;
  errorMail: boolean = false;
  errorUsername: boolean = false;
  maxBirthdate: string;

  form: FormGroup = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(5), Validators.pattern("^[a-zA-Z0-9_-]{5,20}$")]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9]+(?:.[a-z0-9]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]],
    phone: ['', [Validators.required]]
  });


  constructor(private _profileService: ProfileService, private _authService: AuthenticationService, private _fb: FormBuilder
    , private _registrationService: RegistrationService) {
    this.ImagePath = "assets/img/AdminIcon.png";
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear() - 14, currentDate.getMonth(), currentDate.getDate());
    this.maxBirthdate = maxDate.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this._authService.GetUsernameFromToken().subscribe(value => {
      this._profileService.getUserFromUsername(value.username).subscribe(user => {
        this._admin = {
          id: user.id,
          username: user.username,
          userType: user.userType,
          password: user.password,
          email: user.email,
          birthdate: user.birthdate,
          phoneNumber: user.phoneNumber
        };
        this.form.setValue({
          username: this._admin.username,
          birthDate: new Date(this._admin.birthdate).toISOString().slice(0, 10),
          email: this._admin.email,
          phone: this._admin.phoneNumber
        });
      });
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const newEmail = this.form.get('email')?.value
      const newUsername = this.form.get('username')?.value;
      this._registrationService.fetchByEmail(newEmail).subscribe(
        (response) => {
          if (response.isInDb && newEmail != this._admin.email) {
            this.errorMail = true;
          } else {
            this.errorMail = false;
            this._registrationService.fetchByUsername(newUsername).subscribe(
              response => {
                if (response.isInDb && newUsername != this._admin.username) {
                  this.errorUsername = true;
                } else {
                  this.errorUsername = false;
                  this._admin = {
                    id: this._admin.id,
                    username: newUsername,
                    userType: this._admin.userType,
                    password: this._admin.password,
                    email: newEmail,
                    birthdate: this.form.get('birthDate')?.value,
                    phoneNumber: this.form.get('phone')?.value
                  }
                  this.QuitEditMode();
                  this._profileService.updateAdmin(this._admin.id, this._admin).subscribe();
                  const dto: DtoInputToken = { username: this._admin.username, usertype: this._admin.userType };
                  this._authService.generateToken(dto).subscribe(
                    value => {
                    },
                    error => {
                    }
                  );
                }
              }
            )
          }
        }
      );
    }
  }


  EnterEditMode() {
    this.editMode = true;
  }

  QuitEditMode() {
    this.editMode = false;
  }

  controlUsername()
    :
    boolean {
    if (this.form.get('username')?.valid && this.form.get('username')?.touched) {
      return true;
    } else if (this.form.get('username')?.invalid && this.form.get('username')?.touched && this.form.get('username')?.dirty) {
      return false;
    }
    return true;
  }

  controlEmail()
    :
    boolean {
    if (this.form.get('email')?.valid && this.form.get('email')?.touched) {
      return true;
    } else if (this.form.get('email')?.invalid && this.form.get('email')?.touched && this.form.get('email')?.dirty) {
      return false;
    }
    return true;
  }
}
