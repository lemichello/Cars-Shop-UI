import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { Vendor } from './vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Vendor[]> {
    return this.httpClient.get<Vendor[]>(`${AppSettings.BASE_ADDRESS}/vendors`);
  }
}
