import { Injectable } from '@angular/core';
import { PaginationOutput } from './pagination-output';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  constructor() {}

  public static paginate(
    paginationData: PaginationOutput,
    collection: any[]
  ): any[] {
    return collection.slice(
      paginationData.pageIndex * paginationData.pageSize,
      paginationData.pageSize * (paginationData.pageIndex + 1)
    );
  }
}
