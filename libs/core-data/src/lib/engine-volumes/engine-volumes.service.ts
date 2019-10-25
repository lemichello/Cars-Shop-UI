import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app-settings';
import { EngineVolume } from './engine-volume';

@Injectable({
  providedIn: 'root'
})
export class EngineVolumesService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<EngineVolume[]> {
    return this.httpClient.get<EngineVolume[]>(
      `${AppSettings.BASE_ADDRESS}/enginevolumes`
    );
  }
}
