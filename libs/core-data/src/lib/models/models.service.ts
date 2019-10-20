import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(private httpClient: HttpClient) {}

  getByVendor(vendorId: number): Observable<Object> {
    return this.httpClient.get(
      `${AppSettings.BASE_ADDRESS}/models/${vendorId}`
    );
  }
}
