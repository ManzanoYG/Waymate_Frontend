import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-popup-not-have-permission',
  templateUrl: './popup-not-have-permission.component.html',
  styleUrls: ['./popup-not-have-permission.component.css']
})
export class PopupNotHavePermissionComponent {

  constructor(private _ref: MatDialogRef<PopupNotHavePermissionComponent>) {
  }

  closePopup() {
    this._ref.close();
  }
}
