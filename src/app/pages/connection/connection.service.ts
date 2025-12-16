import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DtoOutputToken} from "./dto/dto-output-token";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private static _URL_API_AUTH: string = environment.BASE_URL_API + "/authentication/login";
  constructor(private _httpClient: HttpClient) { }

  login(email: string, password: string): Observable<DtoOutputToken> {
    return this._httpClient.get<DtoOutputToken>(`${ConnectionService._URL_API_AUTH}?email=${email}&password=${password}`, { withCredentials: true });
  }
}
