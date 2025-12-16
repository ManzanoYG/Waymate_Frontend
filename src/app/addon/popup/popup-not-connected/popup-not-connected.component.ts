import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-popup-not-connected',
  templateUrl: './popup-not-connected.component.html',
  styleUrls: ['./popup-not-connected.component.css']
})
export class PopupNotConnectedComponent {

  constructor(private _ref: MatDialogRef<PopupNotConnectedComponent>, private _route: Router) {}

  login(){
    this._route.navigate(['/connection']);
    this.closePopup();
  }
  register(){
    this._route.navigate(['/registration']);
    this.closePopup();
  }

  closePopup() {
    this._ref.close();
  }
}
