import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {ProfileService} from "./profile.service";
import {switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  _userRole!: string;
  _username!: string;

  constructor(private _authService: AuthenticationService, private _profileService: ProfileService, private _dialog: MatDialog, private _router: Router) {
  }

  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: () => {
        this.setInstanceVariable();
      }, error: () => {
        this._dialog.open(PopupNotConnectedComponent);
        this._router.navigate(['/home']);
      }
    });
  }

  verifyRoleAdmin(){
    return this._userRole === "Admin";
  }


  verifyRolePassenger(){
    return this._userRole === "Passenger";
  }

  verifyRoleDriver(){
    return this._userRole === "Driver";
  }

  setInstanceVariable() {
    this._authService.GetUsernameFromToken().pipe(
      switchMap(value => {
        this._username = value.username;
        return this._profileService.getUserFromUsername(this._username);
      })
    ).subscribe({
      next: (value) => {
        this._userRole = value.userType;
      },
      error: err => {
      }
    });
  }
}
