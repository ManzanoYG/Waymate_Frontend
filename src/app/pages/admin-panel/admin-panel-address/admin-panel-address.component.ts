import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DtoInputAddress} from "../dtos/dto-input-address";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdminPanelService} from "../admin-panel.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort,  Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {Router} from "@angular/router";
import {
  PopupNotHavePermissionComponent
} from "../../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";
import {PopupNotConnectedComponent} from "../../../addon/popup/popup-not-connected/popup-not-connected.component";


@Component({
  selector: 'app-admin-panel-address',
  templateUrl: './admin-panel-address.component.html',
  styleUrls: ['./admin-panel-address.component.css']
})
export class AdminPanelAddressComponent implements AfterViewInit, OnInit {
  address: DtoInputAddress[] = [];
  displayedColumns: string[] = ['id', 'street', 'number', 'postalCode', 'city', 'country' , 'edit'];
  dataSource = new MatTableDataSource <DtoInputAddress>(this.address);

  constructor(private _adminPanel: AdminPanelService, private _liveAnnouncer: LiveAnnouncer, private _dialog: MatDialog, private _authService: AuthenticationService, private _router: Router) {
  }

  ngOnInit(): void {
    this._authService.isConnected().subscribe({
      next: () => {
        this._authService.TestConnectionAdmin().subscribe({
          next: () => {

          }, error: () => {
            this._dialog.open(PopupNotHavePermissionComponent);
            this._router.navigate(['/home']);
          }
        });
      }, error: () => {
        this._dialog.open(PopupNotConnectedComponent);
        this._router.navigate(['/home']);
      }
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.getAllAddress();
  }
  getAllAddress() {
    this._adminPanel.getAddress().subscribe(
      response => {
        this.dataSource = new MatTableDataSource <DtoInputAddress>(response);
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
  enableEditMode(address: any): void {
    address.editMode = true;
  }
  disableEditMode(address: any): void {
    address.editMode = false;
    this.updateAddress(address);
  }
  updateAddress(address:any){
    this._adminPanel.updateAddress(address).subscribe(
      () => {
        this.getAllAddress();
      }
    );
  }
}
