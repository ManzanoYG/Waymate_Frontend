import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdminPanelService} from "../admin-panel.service";
import {DtoInputBooking} from "../dtos/dto-input-booking";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../../utils/authentication/authentication.service";
import {Router} from "@angular/router";
import {
  PopupNotHavePermissionComponent
} from "../../../addon/popup/popup-not-have-permission/popup-not-have-permission.component";
import {PopupNotConnectedComponent} from "../../../addon/popup/popup-not-connected/popup-not-connected.component";

@Component({
  selector: 'app-admin-panel-booking',
  templateUrl: './admin-panel-booking.component.html',
  styleUrls: ['./admin-panel-booking.component.css']
})
export class AdminPanelBookingComponent implements AfterViewInit, OnInit {
  bookings: DtoInputBooking[] = [];
  displayedColumns: string[] = ['id', 'date', 'reservedSeats', 'idPassenger', 'idTrip','delete'];
  dataSource = new MatTableDataSource <DtoInputBooking>(this.bookings);

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
    this.getAllBooking();
  }

  getAllBooking() {
    this._adminPanel.getAllBooking().subscribe(
      response => {
        this.dataSource = new MatTableDataSource <DtoInputBooking>(response);
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

  deleteBookink(booking: any) {
    this._adminPanel.deleteBooking(booking.id).subscribe(
      response => {
        this.getAllBooking()
    });
  }
}
