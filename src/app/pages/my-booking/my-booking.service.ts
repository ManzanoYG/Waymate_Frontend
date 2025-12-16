import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";
import {DtoInputDriver} from "./dtos/dto-input-driver";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoInputCar} from "./dtos/dto-input-car";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputBooking} from "./dtos/dto-input-booking";
import {DtoOutputUser} from "../my-trip/dtos/dto-output-user";

@Injectable({
  providedIn: 'root'
})
export class MyBookingService {
  private static _URL_API_GET_USER_BY_USERNAME: string = environment.BASE_URL_API + "/user/GetByUsername";
  private static _URL_API_BOOKING: string = environment.BASE_URL_API + "/booking";
  private static _URL_API_DRIVER: string = environment.BASE_URL_API + "/driver";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  private static _URL_API_TRIP: string = environment.BASE_URL_API + "/trip";

  constructor(private _httpClient: HttpClient) { }

  getAllBookingDetails(): Observable<{ bookings: DtoInputBooking[], trips: DtoInputTrip[], addresses: DtoInputAddress[], drivers: DtoInputDriver[]}> {
    return forkJoin([
      this.getAllBooking(),
      this.getAllTrip(),
      this.getAllAddress(),
      this.getAllDriver(),
    ]).pipe(
      map(([bookings, trips, addresses, drivers]) => ({ bookings, trips, addresses, drivers }))
    );
  }

  getAllDriver(): Observable<DtoInputDriver[]> {
    return this._httpClient.get<DtoInputDriver[]>(MyBookingService._URL_API_DRIVER);
  }

  getAllAddress(): Observable<DtoInputAddress[]> {
    return this._httpClient.get<DtoInputAddress[]>(MyBookingService._URL_API_ADDRESS);
  }
  getAllTrip(): Observable<DtoInputTrip[]> {
    return this._httpClient.get<DtoInputTrip[]>(MyBookingService._URL_API_TRIP);
  }
  getAllBooking(): Observable<DtoInputBooking[]>{
    return this._httpClient.get<DtoInputBooking[]>(MyBookingService._URL_API_BOOKING)
  }

  getUserFromUsername(username: string): Observable<DtoOutputUser> {
    return this._httpClient.get<DtoOutputUser>(`${MyBookingService._URL_API_GET_USER_BY_USERNAME}/${username}`);
  }
}
