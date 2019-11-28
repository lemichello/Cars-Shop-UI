import { Component, OnInit } from '@angular/core';
import { CarsService, Car, CarsFilter } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { Router } from '@angular/router';

const DEFAULT_FILTER: CarsFilter = {
  modelsId: [],
  engineVolumeId: null,
  colorId: null,
  price: {
    selectedDate: null,
    fromPrice: 0,
    toPrice: Number.MAX_SAFE_INTEGER
  }
};

@Component({
  selector: 'cars-shop-ui-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  colsNumber = 3;
  paginationLength: number;
  currentIndex: number;
  currentSize: number;
  cars: Car[];
  currentFilter: CarsFilter;

  constructor(private carsService: CarsService, private router: Router) {
    this.currentFilter = DEFAULT_FILTER;
  }

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
    this.currentIndex = paginationData.pageIndex;
    this.currentSize = paginationData.pageSize;

    this.carsService
      .getFilteredCars(
        paginationData.pageIndex,
        paginationData.pageSize,
        this.currentFilter
      )
      .subscribe(res => {
        this.cars = res;
      });
  }

  navigateToCar(carId: number): void {
    this.router.navigate(['catalog/car', carId]);
  }

  resetFilters(): void {
    this.currentFilter = DEFAULT_FILTER;
    this.paginateCars({
      pageSize: this.colsNumber * 5,
      pageIndex: 0,
      colsNumber: this.colsNumber
    });
  }

  filterCars(filter: CarsFilter): void {
    this.currentFilter = filter;
    this.currentIndex = 0;
    this.currentSize = this.colsNumber * 5;

    this.carsService
      .getFilteredCars(this.currentIndex, this.currentSize, filter)
      .subscribe(res => {
        this.cars = res;
        this.paginationLength = this.cars.length;
      });
  }
}
