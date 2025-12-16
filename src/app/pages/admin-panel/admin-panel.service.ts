import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DtoInputUser} from "./dtos/dto-input-user";
import {DtoOutputAdmin} from "./dtos/dto-output-admin";
import {DtoOutputDriver} from "./dtos/dto-output-driver";
import {DtoOutputPassenger} from "./dtos/dto-output-passenger";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoInputCar} from "./dtos/dto-input-car";
import {DtoOutputCar} from "./dtos/dto-output-car";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputBooking} from "./dtos/dto-input-booking";
import {DtoOutputTrip} from "./dtos/dto-output-trip";


@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  private static _URL_API_USER: string = environment.BASE_URL_API + "/user";
  private static _URL_API_ADMIN: string = environment.BASE_URL_API + "/admin";
  private static _URL_API_DRIVER: string = environment.BASE_URL_API + "/driver";
  private static _URL_API_PASSENGER: string = environment.BASE_URL_API + "/passenger";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  private static _URL_API_CAR: string = environment.BASE_URL_API + "/car";
  private static _URL_API_TRIP: string = environment.BASE_URL_API + "/trip";
  private static _URL_API_BOOKING: string = environment.BASE_URL_API + "/booking";
  constructor(private _httpClient: HttpClient) { }

  getAllUser(): Observable<DtoInputUser[]> {
    return this._httpClient.get<DtoInputUser[]>(AdminPanelService._URL_API_USER);
  }

  getAddress(): Observable<DtoInputAddress[]> {
    return this._httpClient.get<DtoInputAddress[]>(AdminPanelService._URL_API_ADDRESS);
  }

  getAllCar(): Observable<DtoInputCar[]> {
    return this._httpClient.get<DtoInputCar[]>(AdminPanelService._URL_API_CAR);
  }

  getAllTrip(): Observable<DtoInputTrip[]> {
    return this._httpClient.get<DtoInputTrip[]>(AdminPanelService._URL_API_TRIP);
  }

  getAllBooking(): Observable<DtoInputBooking[]> {
    return this._httpClient.get<DtoInputBooking[]>(AdminPanelService._URL_API_BOOKING);
  }

  updateAdmin(dto:DtoOutputAdmin): Observable<DtoInputUser> {
    return this._httpClient.put<DtoInputUser>(AdminPanelService._URL_API_ADMIN +"/"+ dto.id, dto);
  }
  updateDriver(dto:DtoOutputDriver): Observable<DtoInputUser> {
    return this._httpClient.put<DtoInputUser>(AdminPanelService._URL_API_DRIVER +"/"+ dto.id, dto);
  }

  updatePassenger(dto:DtoOutputPassenger): Observable<DtoInputUser> {
    return this._httpClient.put<DtoInputUser>(AdminPanelService._URL_API_PASSENGER +"/"+ dto.id, dto);
  }

  updateAddress(dto:DtoOutputPassenger): Observable<DtoInputUser> {
    return this._httpClient.put<DtoInputUser>(AdminPanelService._URL_API_ADDRESS +"/"+ dto.id, dto);
  }

  updateCar(dto:DtoOutputCar): Observable<DtoInputCar> {
    return this._httpClient.put<DtoInputCar>(AdminPanelService._URL_API_CAR +"/"+ dto.numberPlate, dto);
  }

  updateTrip(dto:DtoOutputTrip): Observable<DtoInputTrip> {
    return this._httpClient.put<DtoInputTrip>(AdminPanelService._URL_API_TRIP +"/"+ dto.id, dto);
  }

  deleteBooking(id:number): Observable<DtoInputBooking>{
    return this._httpClient.delete<DtoInputBooking>(AdminPanelService._URL_API_BOOKING + "/" + id);
  }
}
