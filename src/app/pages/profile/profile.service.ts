import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DtoOutputUser } from './dto/dto-output-user';
import {DtoOutputAdmin} from "./dto/dto-output-admin";
import {DtoInputAddress} from "../trip-search/dtos/dto-input-address";
import {DtoOutputPassenger} from "./dto/dto-output-passenger";
import {DtoInputCar} from "./dto/dto-input-car";
import {DtoOuputCar} from "./dto/dto-ouput-car";
import {DtoOutputDriver} from "./dto/dto-output-driver";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private static _URL_API_GET_USER_BY_USERNAME: string = environment.BASE_URL_API + "/user/GetByUsername";
  private static _URL_API_UPDATE_ADMIN: string = environment.BASE_URL_API + "/admin";
  private static _URL_API_UPDATE_PASSENGER: string = environment.BASE_URL_API + "/passenger";
  private static _URL_API_GET_ADDRESS_BY_ID: string = environment.BASE_URL_API + "/address";
  private static _URL_API_GET_CAR_BY_ID: string = environment.BASE_URL_API + "/car/getById";
  private static _URL_API_CREATE_CAR: string = environment.BASE_URL_API + "/car";
  private static _URL_API_UPDATE_CAR: string = environment.BASE_URL_API + "/car/update";
  private static _URL_API_CHANGE_USERTYPE: string = environment.BASE_URL_API + "/passenger/changeUserType";
  private static _URL_API_UPDATE_DRIVER: string= environment.BASE_URL_API + "/driver";


  constructor(private _httpClient: HttpClient) { }

  getUserFromUsername(username: string): Observable<DtoOutputUser> {
    return this._httpClient.get<DtoOutputUser>(`${ProfileService._URL_API_GET_USER_BY_USERNAME}/${username}`);
  }
  updateAdmin(id: number, dto: DtoOutputAdmin): Observable<any> {
    return this._httpClient.put(`${ProfileService._URL_API_UPDATE_ADMIN}/${id}`, dto);
  }

  updatePassenger(id: number, dto: DtoOutputPassenger): Observable<any> {
    return this._httpClient.put(`${ProfileService._URL_API_UPDATE_PASSENGER}/${id}`, dto);
  }

  updateCar(id: string, dto: DtoOuputCar): Observable<any> {
    return this._httpClient.put(`${ProfileService._URL_API_UPDATE_CAR}/${id}`, dto);
  }

  getAddressById(id: number): Observable<DtoInputAddress>{
    return this._httpClient.get<DtoInputAddress>(`${ProfileService._URL_API_GET_ADDRESS_BY_ID}/${id}`);
  }
  getCarById(numberPlate: string): Observable<DtoInputCar>{
    return this._httpClient.get<DtoInputCar>(`${ProfileService._URL_API_GET_CAR_BY_ID}/${numberPlate}`);
  }

  createCar(dto: DtoOuputCar): any{
    return this._httpClient.post(`${ProfileService._URL_API_CREATE_CAR}`, dto);
  }

  changerUserType(id: number){
    return this._httpClient.get(`${ProfileService._URL_API_CHANGE_USERTYPE}/${id}`);
  }

  updateDriver(id: number, dto: DtoOutputDriver): Observable<any> {
    return this._httpClient.put(`${ProfileService._URL_API_UPDATE_DRIVER}/${id}`, dto);
  }

}
