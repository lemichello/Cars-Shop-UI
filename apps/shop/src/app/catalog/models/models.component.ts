import { Component, OnInit } from '@angular/core';
import { Model, ModelsService } from '@cars-shop-ui/core-data';
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
  paginationLength: number;
  models: Model[];

  constructor(
    private modelsService: ModelsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vendorId = +params['vendorId'];
    });

    this.modelsService
      .getByVendor(this.vendorId, 0, this.colsNumber * 5)
      .subscribe(res => {
        this.models = res;
        this.modelsService.getCount().subscribe(count => {
          this.paginationLength = count;
        });
      });
  }

  paginateModels(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;

    this.modelsService
      .getByVendor(
        this.vendorId,
        paginationData.pageIndex,
        paginationData.pageSize
      )
      .subscribe(res => {
        this.models = res;
      });
  }
}
