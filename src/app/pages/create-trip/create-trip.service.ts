import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DtoOutputFetchByAddress} from "./dtos/dto-output-fetch-by-address";
import {DtoOutputUser} from "./dtos/dto-output-user";
import {DtoOutputAddress} from "./dtos/dto-output-address";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoOutputTrip} from "./dtos/dto-output-trip";
import {DtoInputTrip} from "./dtos/dto-input-trip";

@Injectable({
  providedIn: 'root'
})
export class CreateTripService {
  private static _URL_API_USER: string = environment.BASE_URL_API + "/user/GetByUsername";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  private static _URL_API_ADDRESS_ID: string = environment.BASE_URL_API + "/address/get-id";
  private static _URL_API_TRIP: string = environment.BASE_URL_API + "/trip";

  constructor(private _httpClient: HttpClient) {
  }

  fetchByUsername(username:string): Observable<DtoOutputUser> {
    return this._httpClient.get<DtoOutputUser>(`${CreateTripService._URL_API_USER}/${username}`);
  }
  fetchByAddress(street:string, postalCode:string, city:string, number:string, country: string): Observable<DtoOutputFetchByAddress> {
    return this._httpClient.get<DtoOutputFetchByAddress>(`${CreateTripService._URL_API_ADDRESS_ID}?street=${street}&postalCode=${postalCode}&city=${city}&number=${number}&country=${country}`);
  }

  insertAddress(dto: DtoOutputAddress): Observable<DtoInputAddress> {
    return this._httpClient.post<DtoInputAddress>(CreateTripService._URL_API_ADDRESS, dto);
  }


  insertTrip(dto: DtoOutputTrip): Observable<DtoInputTrip> {
    return this._httpClient.post<DtoInputTrip>(CreateTripService._URL_API_TRIP, dto);
  }

}
