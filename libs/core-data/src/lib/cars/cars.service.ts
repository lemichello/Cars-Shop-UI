import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { CarDto } from './carDto';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Object> {
    return this.httpClient.get(`${AppSettings.BASE_ADDRESS}/cars`);
  }

  add(car: CarDto): Observable<Object> {
    return this.httpClient.post(`${AppSettings.BASE_ADDRESS}/cars`, car);
  }
}
