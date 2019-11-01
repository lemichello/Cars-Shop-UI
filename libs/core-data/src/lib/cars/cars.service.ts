import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { CarDto } from './carDto';
import { Car } from './car';
import { ParamsService } from '../params/params.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  constructor(private httpClient: HttpClient) {}

  getAll(index: number, size: number): Observable<Car[]> {
    return this.httpClient.get<Car[]>(`${AppSettings.BASE_ADDRESS}/cars`, {
      params: ParamsService.getPaginationParams(index, size)
    });
  }

  add(car: CarDto): Observable<Object> {
    return this.httpClient.post(`${AppSettings.BASE_ADDRESS}/cars`, car);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(
      `${AppSettings.BASE_ADDRESS}/cars/count`
    );
  }
}
