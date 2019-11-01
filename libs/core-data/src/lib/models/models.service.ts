import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { Model } from './model';
import { ParamsService } from '../params/params.service';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(private httpClient: HttpClient) {}

  getByVendor(
    vendorId: number,
    index?: number,
    size?: number
  ): Observable<Model[]> {
    return this.httpClient.get<Model[]>(
      `${AppSettings.BASE_ADDRESS}/models/${vendorId}`,
      { params: ParamsService.getPaginationParams(index, size) }
    );
  }

  add(model: { name: string; vendorId: number }): Observable<Object> {
    return this.httpClient.post(`${AppSettings.BASE_ADDRESS}/models`, model);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(
      `${AppSettings.BASE_ADDRESS}/models/count`
    );
  }
}
