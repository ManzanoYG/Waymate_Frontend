import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DtoInputTrip} from "../trip-search/dtos/dto-input-trip";
import {DtoInputAddress} from "../trip-search/dtos/dto-input-address";
import {DtoInputDriver} from "../trip-search/dtos/dto-input-driver";
import {DtoInputCar} from "./dtos/dto-input-car";
import {DtoOutputCreateBooking} from "./dtos/dto-output-create-booking";
import {DtoInputBooking} from "./dtos/dto-input-booking";
import {DtoInputUser} from "../registration/dtos/dto-input-user";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private static _URL_API_TRIP: string = environment.BASE_URL_API + "/trip";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  private static _URL_API_DRIVER: string = environment.BASE_URL_API + "/driver";
  private static _UTL_API_CAR: string = environment.BASE_URL_API + "/car/getById";
  private static _UTL_API_BOOKING: string = environment.BASE_URL_API + "/booking";
  private static _UTL_API_USER: string = environment.BASE_URL_API + "/user/GetByUsername";
  constructor(private _httpClient: HttpClient) {
  }

  getAllTrip(id:number): Observable<DtoInputTrip> {
    return this._httpClient.get<DtoInputTrip>(`${BookingService._URL_API_TRIP}/${id}`);
  }

  getAllAddress(id:number): Observable<DtoInputAddress> {
    return this._httpClient.get<DtoInputAddress>(`${BookingService._URL_API_ADDRESS}/${id}`);
  }

  getAllDriver(id:number): Observable<DtoInputDriver> {
    return this._httpClient.get<DtoInputDriver>(`${BookingService._URL_API_DRIVER}/${id}`);
  }

  getAllCar(carplate:string): Observable<DtoInputCar> {
    return this._httpClient.get<DtoInputCar>(`${BookingService._UTL_API_CAR}/${carplate}`);
  }

  createBooking(dto:DtoOutputCreateBooking): Observable<DtoInputBooking> {
    return this._httpClient.post<DtoInputBooking>(BookingService._UTL_API_BOOKING,dto);
  }

  getUserB(username:string): Observable<DtoInputUser> {
    return this._httpClient.get<DtoInputUser>(`${BookingService._UTL_API_USER}/${username}`);
  }
}
