import {AfterViewInit, booleanAttribute, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdminPanelService} from "../admin-panel.service";
import {DtoInputTrip} from "../dtos/dto-input-trip";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {Router} from "@angular/router";
import {
  PopupNotHavePermissionComponent
} from "../../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";
import {PopupNotConnectedComponent} from "../../../addon/popup/popup-not-connected/popup-not-connected.component";

@Component({
  selector: 'app-admin-panel-trip',
  templateUrl: './admin-panel-trip.component.html',
  styleUrls: ['./admin-panel-trip.component.css']
})
export class AdminPanelTripComponent implements AfterViewInit, OnInit {
  trips: DtoInputTrip[] = [];
  displayedColumns: string[] = ['id', 'idDriver', 'date', 'price',  'smoke','luggage', 'petFriendly', 'airConditioning', 'driverMessage', 'idStartingPoint', 'idDestination', 'edit'];
  dataSource = new MatTableDataSource <DtoInputTrip>(this.trips);

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


  ngAfterViewInit(): void {
    this.getAllTrip();
  }

  getAllTrip() {
    this._adminPanel.getAllTrip().subscribe(
      response => {
        this.dataSource = new MatTableDataSource <DtoInputTrip>(response);
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

  enableEditMode(trip: any): void {
    trip.editMode = true;

  }

  disableEditMode(trip: any): void {
    trip.editMode = false;
    this.updateTrip(trip);
  }

  updateTrip(trip:any){
    trip.smoke = (booleanAttribute(trip.smoke));
    trip.luggage = (booleanAttribute(trip.luggage));
    trip.petFriendly = (booleanAttribute(trip.petFriendly));
    trip.airConditioning = (booleanAttribute(trip.airConditioning));
    this._adminPanel.updateTrip(trip).subscribe(
      response => {
        this.getAllTrip();
      },
      error => {
      }
    )
  }
}
