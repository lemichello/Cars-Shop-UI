import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { Model } from './model';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(private httpClient: HttpClient) {}

  getByVendor(vendorId: number): Observable<Model[]> {
    return this.httpClient.get<Model[]>(
      `${AppSettings.BASE_ADDRESS}/models/${vendorId}`
    );
  }

  add(model: { name: string; vendorId: number }): Observable<Object> {
    return this.httpClient.post(`${AppSettings.BASE_ADDRESS}/models`, model);
  }
}
