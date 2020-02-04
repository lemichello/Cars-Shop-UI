import { Component, OnInit } from '@angular/core';
import { Model, ModelsService, VendorsService } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cars-shop-ui-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  vendorId: number;
  colsNumber = 3;
  currentIndex: number;
  currentSize: number;
  paginationLength: number;
  models: Model[];
  paginatedModels: Model[];

  constructor(
    private modelsService: ModelsService,
    private vendorsService: VendorsService,
    private route: ActivatedRoute
  ) {
    this.currentIndex = 0;
    this.currentSize = this.colsNumber * 5;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vendorId = +params['vendorId'];
    });

    this.vendorsService.getDetailed().subscribe(res => {
      this.models = res.data.vendors.find(
        vendor => vendor.id === this.vendorId
      ).models;

      const startIndex = this.currentIndex * this.currentSize;
      const endIndex = startIndex + this.currentSize;

      this.paginatedModels = this.models.slice(startIndex, endIndex);
      this.paginationLength = this.models.length;
    });
  }

  paginateModels(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;
    this.currentIndex = paginationData.pageIndex;
    this.currentSize = paginationData.pageSize;

    const startIndex = this.currentIndex * this.currentSize;
    const endIndex = startIndex + this.currentSize;

    this.paginatedModels = this.models.slice(startIndex, endIndex);
  }
}
