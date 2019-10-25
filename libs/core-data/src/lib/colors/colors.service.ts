import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { Color } from './color';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Color[]> {
    return this.httpClient.get<Color[]>(`${AppSettings.BASE_ADDRESS}/colors`);
  }
}
