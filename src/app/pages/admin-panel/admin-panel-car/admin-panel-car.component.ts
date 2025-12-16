import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {DtoInputCar} from "../dtos/dto-input-car";
import {AdminPanelService} from "../admin-panel.service";
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
  selector: 'app-admin-panel-car',
  templateUrl: './admin-panel-car.component.html',
  styleUrls: ['./admin-panel-car.component.css']
})
export class AdminPanelCarComponent implements AfterViewInit, OnInit  {
  cars: DtoInputCar[] = [];
  displayedColumns: string[] = ['numberPlate', 'brand', 'model', 'nbSeats', 'carType', 'fuelType', 'color', 'edit'];
  dataSource = new MatTableDataSource <DtoInputCar>(this.cars);

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
    this.getAllCar();
  }


  getAllCar() {
    this._adminPanel.getAllCar().subscribe(
      response => {
        this.dataSource = new MatTableDataSource <DtoInputCar>(response);
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

  enableEditMode(car: any): void {
    car.editMode = true;
  }

  disableEditMode(car: any): void {
    car.editMode = false;
    this.updateCar(car);
  }

  updateCar(car:any){
    car.fuelType = parseInt(car.fuelType, 10);
    car.carType = parseInt(car.carType, 10);
    this._adminPanel.updateCar(car).subscribe(
      response => {
        this.getAllCar();
      }
    );
  }
}
