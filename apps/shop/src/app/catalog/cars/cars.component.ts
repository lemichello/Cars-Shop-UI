import { Component, OnInit } from '@angular/core';
import { CarsService, Car } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { Router } from '@angular/router';

@Component({
  selector: 'cars-shop-ui-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  colsNumber = 2;
  paginationLength: number;
  cars: Car[];

  constructor(private carsService: CarsService, private router: Router) {}

  ngOnInit() {
    this.carsService.getAll(0, this.colsNumber * 5).subscribe(res => {
      this.cars = res;
      this.carsService.getCount().subscribe(count => {
        this.paginationLength = count;
      });
    });
  }

  paginateCars(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;

    this.carsService
      .getAll(paginationData.pageIndex, paginationData.pageSize)
      .subscribe(res => {
        this.cars = res;
      });
  }

  navigateToCar(carId: number) {
    this.router.navigate(['catalog/car', carId]);
  }
}
