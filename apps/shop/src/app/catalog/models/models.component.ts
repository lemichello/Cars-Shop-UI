import { Component, Input, OnInit } from '@angular/core';
import { Model, ModelsService } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '../paginator/pagination.service';

@Component({
  selector: 'cars-shop-ui-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  vendorId: number;
  colsNumber = 3;
  paginationLength: number;
  models: any;
  displayModels: Model[];

  constructor(
    private modelsService: ModelsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vendorId = +params['vendorId'];
    });

    this.modelsService.getByVendor(this.vendorId).subscribe(res => {
      this.models = res;
      this.paginationLength = this.models.length;

      this.paginateModels({
        colsNumber: this.colsNumber,
        pageIndex: 0,
        pageSize: this.colsNumber * 5
      });
    });
  }

  paginateModels(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;

    this.displayModels = PaginationService.paginate(
      paginationData,
      this.models
    );
  }
}
