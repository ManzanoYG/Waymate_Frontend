import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../utils/authentication/authentication.service";
import {PopupNotConnectedComponent} from "../../addon/popup/popup-not-connected/popup-not-connected.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {
  PopupNotHavePermissionComponent
} from "../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit{

  constructor(private _dialog: MatDialog, private _authService: AuthenticationService, private _router: Router) {
  }

  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: (value) => {
        this._authService.TestConnectionAdmin().subscribe({
          next: (value) => {

          }, error: (err) => {
            this._dialog.open(PopupNotHavePermissionComponent);
            this._router.navigate(['/home']);
          }
        });
      }, error: (err) => {
        this._dialog.open(PopupNotConnectedComponent);
        this._router.navigate(['/home']);
      }
    });
  }
}
