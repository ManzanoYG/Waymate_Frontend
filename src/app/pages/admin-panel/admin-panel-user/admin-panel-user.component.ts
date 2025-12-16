import {AfterViewInit, booleanAttribute, Component, OnInit, ViewChild} from '@angular/core';
import {DtoInputUser} from "../dtos/dto-input-user";
import {AdminPanelService} from "../admin-panel.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";
import {
  PopupNotHavePermissionComponent
} from "../../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";
import {PopupNotConnectedComponent} from "../../../addon/popup/popup-not-connected/popup-not-connected.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-panel-user',
  templateUrl: './admin-panel-user.component.html',
  styleUrls: ['./admin-panel-user.component.css']
})
export class AdminPanelUserComponent implements AfterViewInit, OnInit  {
  users: DtoInputUser[] = [];
  displayedColumns: string[] = ['id', 'userType', 'username', 'lastName', 'firstName', 'email', 'birthdate', 'phoneNumber', 'gender', 'addressId', 'carPlate', 'isBanned', 'edit', 'ban'];
  dataSource = new MatTableDataSource <DtoInputUser>(this.users);

  constructor(private _adminPanel: AdminPanelService, private _liveAnnouncer: LiveAnnouncer, private _dialog: MatDialog, private _authService: AuthenticationService, private _router: Router) {
  }

  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: () => {
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getAllUser();

  }


  getAllUser() {
    this._adminPanel.getAllUser().subscribe(
      response => {
        this.dataSource = new MatTableDataSource <DtoInputUser>(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  banUser(user: any) {
    if(user.isBanned == false){
      user.isBanned = true;
      this.updateUser(user);
    }
  }

  unbanUser(user: any) {
    if(user.isBanned == true){
      user.isBanned = false;
      this.updateUser(user);
    }
  }

  enableEditMode(user: any): void {
    user.editMode = true;
  }

  disableEditMode(user: any): void {
    user.editMode = false;
    this.updateUser(user);
  }

  updateUser(user: any){
    user.isBanned = booleanAttribute(user.isBanned);
    if(user.userType == "Driver") {
      this._adminPanel.updateDriver(user).subscribe(
        response => {
          this.getAllUser();
        }
      )
    } else if (user.userType == "Passenger"){
      this._adminPanel.updatePassenger(user).subscribe(
        response => {
          this.getAllUser();
        }
      )
    } else {
      this._adminPanel.updateAdmin(user).subscribe(
        response => {
          this.getAllUser();
        }
      )
    }
  }
}
