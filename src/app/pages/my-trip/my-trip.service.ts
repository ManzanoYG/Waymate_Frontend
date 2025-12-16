import { Injectable } from '@angular/core';
import {DtoOutputUser} from "./dtos/dto-output-user";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {forkJoin, map, Observable} from "rxjs";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoOutputTrip} from "./dtos/dto-output-trip";

@Injectable({
  providedIn: 'root'
})
export class MyTripService {
  private static _URL_API_GET_USER_BY_USERNAME: string = environment.BASE_URL_API + "/user/GetByUsername";
  private static _URL_API_TRIP: string = environment.BASE_URL_API + "/trip";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  constructor(private _httpClient: HttpClient) {
  }

  getUserFromUsername(username: string): Observable<DtoOutputUser> {
    return this._httpClient.get<DtoOutputUser>(`${MyTripService._URL_API_GET_USER_BY_USERNAME}/${username}`);
  }

  getAllTrip(): Observable<DtoInputTrip[]> {
    return this._httpClient.get<DtoInputTrip[]>(MyTripService._URL_API_TRIP);
  }

  getAllAddress(): Observable<DtoInputAddress[]> {
    return this._httpClient.get<DtoInputAddress[]>(MyTripService._URL_API_ADDRESS);
  }

  getAllTripDetails(): Observable<{ trips: DtoInputTrip[], addresses: DtoInputAddress[] }> {
    return forkJoin([
      this.getAllTrip(),
      this.getAllAddress()
    ]).pipe(
      map(([trips, addresses]) => ({ trips, addresses }))
    );
  }

  getTrip(id:number): Observable<DtoInputTrip> {
    return this._httpClient.get<DtoInputTrip>(`${MyTripService._URL_API_TRIP}/${id}`);
  }

  getAddress(id:number): Observable<DtoInputAddress> {
    return this._httpClient.get<DtoInputAddress>(`${MyTripService._URL_API_ADDRESS}/${id}`);
  }

  updateTrip(dto:DtoOutputTrip): Observable<DtoInputTrip> {
    return this._httpClient.put<DtoInputTrip>(MyTripService._URL_API_TRIP +"/"+ dto.id, dto);
  }
}
