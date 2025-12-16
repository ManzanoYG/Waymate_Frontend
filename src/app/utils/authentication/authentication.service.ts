import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {DtoInputUsername} from "./dto/dto-input-username";
import {DtoInputToken} from "../../pages/connection/dto/dto-input-token";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private static _URL_API_LOGOUT: string = environment.BASE_URL_API + "/authentication/logout";
  private static _URL_API_IS_CONNECTED: string = environment.BASE_URL_API + "/authentication/IsConnected";
  private static _URL_API_TEST_CONNECTION_PASSENGER = environment.BASE_URL_API + "/authentication/TestConnectionPassenger";
  private static _URL_API_TEST_CONNECTION_DRIVER = environment.BASE_URL_API + "/authentication/TestConnectionDriver";
  private static _URL_API_TEST_CONNECTION_ADMIN = environment.BASE_URL_API + "/authentication/TestConnectionAdmin";
  private static _URL_API_GET_USERNAME = environment.BASE_URL_API + "/authentication/getUsername";
  private static _URL_API_GENERATE_TOKEN = environment.BASE_URL_API + "/authentication/generationToken";
  constructor(private _httpClient: HttpClient) { }

  logout(): Observable<any> {
    return this._httpClient.post(`${AuthenticationService._URL_API_LOGOUT}`, {}, { withCredentials: true });
  }

  isConnected(): Observable<any> {
    return this._httpClient.get(`${AuthenticationService._URL_API_IS_CONNECTED}`, { withCredentials: true });
  }

  TestConnectionPassenger(): Observable<any>{
    return this._httpClient.get(`${AuthenticationService._URL_API_TEST_CONNECTION_PASSENGER}`, { withCredentials: true });
  }

  TestConnectionDriver(): Observable<any>{
    return this._httpClient.get(`${AuthenticationService._URL_API_TEST_CONNECTION_DRIVER}`, { withCredentials: true });
  }

  TestConnectionAdmin(): Observable<any>{
    return this._httpClient.get(`${AuthenticationService._URL_API_TEST_CONNECTION_ADMIN}`, { withCredentials: true });
  }

  GetUsernameFromToken(): Observable<DtoInputUsername>{
    return this._httpClient.get<DtoInputUsername>(`${AuthenticationService._URL_API_GET_USERNAME}`, { withCredentials: true });
  }


  generateToken(dto: DtoInputToken): Observable<any> {
    return this._httpClient.post(AuthenticationService._URL_API_GENERATE_TOKEN, dto, { withCredentials: true });
  }
}
