import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {
  constructor() {}

  public static getPaginationParams(index?: number, size?: number): HttpParams {
    let params = new HttpParams();

    if (isUndefined(index) || isUndefined(size)) {
      return params;
    }

    params = params.append('index', index.toString());
    params = params.append('size', size.toString());

    return params;
  }
}
