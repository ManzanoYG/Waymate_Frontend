import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DtoInputUser} from "./dtos/dto-input-user";
import {DtoOutputCreateUser} from "./dtos/dto-output-create-user";
import {environment} from "../../../environments/environment";
import {DtoOutputRegistration} from "./dtos/dto-output-registration";
import {DtoOutputCreateAddress} from "./dtos/dto-output-create-address";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoOutputFetchByAddress} from "./dtos/dto-output-fetch-by-address";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private static _URL_API_PASSENGER: string = environment.BASE_URL_API + "/Passenger";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  private static _URL_API_REGISTRATION_EMAIL: string = environment.BASE_URL_API + "/authentication/registration/by-email";
  private static _URL_API_REGISTRATION_USERNAME: string = environment.BASE_URL_API + "/authentication/registration/by-username";
  private static _URL_API_REGISTRATION_ADDRESS: string = environment.BASE_URL_API + "/address/get-id";
  private static _URL_API_REGISTRATION: string = environment.BASE_URL_API + "/authentication/registration";

  constructor(private _httpClient: HttpClient) {
  }

  getAll(): Observable<DtoInputUser[]> {
    return this._httpClient.get<DtoInputUser[]>(RegistrationService._URL_API_PASSENGER);
  }

  insertAddress(dto: DtoOutputCreateAddress): Observable<DtoInputAddress> {
    return this._httpClient.post<DtoInputAddress>(RegistrationService._URL_API_ADDRESS, dto);
  }


  fetchByEmail(email:string): Observable<DtoOutputRegistration> {
    return this._httpClient.get<DtoOutputRegistration>(`${RegistrationService._URL_API_REGISTRATION_EMAIL}/${email}`);
  }

  fetchByUsername(username:string): Observable<DtoOutputRegistration> {
    return this._httpClient.get<DtoOutputRegistration>(`${RegistrationService._URL_API_REGISTRATION_USERNAME}/${username}`);
  }
  fetchByAddress(street:string, postalCode:string, city:string, number:string, country: string): Observable<DtoOutputFetchByAddress> {
    return this._httpClient.get<DtoOutputFetchByAddress>(`${RegistrationService._URL_API_REGISTRATION_ADDRESS}?street=${street}&postalCode=${postalCode}&city=${city}&number=${number}&country=${country}`);
  }

  registerUser(dto: DtoOutputCreateUser): Observable<DtoInputUser>{
    return this._httpClient.post<DtoInputUser>(RegistrationService._URL_API_REGISTRATION, dto, { withCredentials: true });
  }
}
