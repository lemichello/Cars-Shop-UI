import { Component, OnInit } from '@angular/core';
import { CarsService, Car } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { PaginationService } from '../paginator/pagination.service';

@Component({
  selector: 'cars-shop-ui-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  colsNumber = 2;
  paginationLength: number;
  cars: any;
  displayCars: Car[];

  constructor(private carsService: CarsService) {}

  ngOnInit() {
    this.carsService.getAll().subscribe(res => {
      this.cars = res;
      this.paginationLength = this.cars.length;

      this.paginateCars({
        colsNumber: this.colsNumber,
        pageIndex: 0,
        pageSize: this.colsNumber * 5
      });
    });
  }

  paginateCars(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;

    this.displayCars = PaginationService.paginate(paginationData, this.cars);
  }
}
