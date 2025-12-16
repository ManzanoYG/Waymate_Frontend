import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";
import {DtoInputTrip} from "./dtos/dto-input-trip";
import {DtoInputAddress} from "./dtos/dto-input-address";
import {DtoInputDriver} from "./dtos/dto-input-driver";

@Injectable({
  providedIn: 'root'
})
export class TripSearchService {
  private static _URL_API_TRIP: string = environment.BASE_URL_API + "/trip";
  private static _URL_API_ADDRESS: string = environment.BASE_URL_API + "/address";
  private static _URL_API_DRIVER: string = environment.BASE_URL_API + "/driver";

  constructor(private _httpClient: HttpClient) {
  }

  getAllTripDetails(): Observable<{ trips: DtoInputTrip[], addresses: DtoInputAddress[], drivers: DtoInputDriver[] }> {
    return forkJoin([
      this.getAllTrip(),
      this.getAllAddress(),
      this.getAllDriver()
    ]).pipe(
      map(([trips, addresses, drivers]) => ({ trips, addresses, drivers }))
    );
  }

  getAllTrip(): Observable<DtoInputTrip[]> {
    return this._httpClient.get<DtoInputTrip[]>(TripSearchService._URL_API_TRIP);
  }

  getAllAddress(): Observable<DtoInputAddress[]> {
    return this._httpClient.get<DtoInputAddress[]>(TripSearchService._URL_API_ADDRESS);
  }

  getAllDriver(): Observable<DtoInputDriver[]> {
    return this._httpClient.get<DtoInputDriver[]>(TripSearchService._URL_API_DRIVER);
  }
}
