import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { Vendor } from './vendor';
import { ParamsService } from '../params/params.service';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  constructor(private httpClient: HttpClient) {}

  getAll(index?: number, size?: number): Observable<Vendor[]> {
    const params = ParamsService.getPaginationParams(index, size);

    return this.httpClient.get<Vendor[]>(
      `${AppSettings.BASE_ADDRESS}/vendors`,
      { params: params }
    );
  }

  add(vendorName: string): Observable<Object> {
    return this.httpClient.post(`${AppSettings.BASE_ADDRESS}/vendors`, {
      name: vendorName
    });
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(
      `${AppSettings.BASE_ADDRESS}/vendors/count`
    );
  }
}
