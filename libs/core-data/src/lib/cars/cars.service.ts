import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { CarDto } from './models/carDto';
import { Car } from './models/car';
import { ParamsService } from '../params/params.service';
import { DetailedCar } from './models/detailed-car';
import { EditCarDto } from './models/edit-car-dto';

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

  getSimplified(carId: number): Observable<EditCarDto> {
    return this.httpClient.get<EditCarDto>(
      `${AppSettings.BASE_ADDRESS}/cars/simplified/${carId}`
    );
  }

  add(car: CarDto): Observable<Object> {
    return this.httpClient.post(`${AppSettings.BASE_ADDRESS}/cars`, car);
  }

  update(car: EditCarDto): Observable<Object> {
    return this.httpClient.put(
      `${AppSettings.BASE_ADDRESS}/cars/${car.id}`,
      car
    );
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(
      `${AppSettings.BASE_ADDRESS}/cars/count`
    );
  }

  getById(carId: number): Observable<HttpResponse<DetailedCar>> {
    return this.httpClient.get<DetailedCar>(
      `${AppSettings.BASE_ADDRESS}/cars/${carId}`,
      { observe: 'response' }
    );
  }
}
