import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get(`${BASE_URL}/vendors`);
  }
}
