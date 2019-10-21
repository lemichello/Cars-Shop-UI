import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Object> {
    return this.httpClient.get(`${AppSettings.BASE_ADDRESS}/cars`);
  }
}
