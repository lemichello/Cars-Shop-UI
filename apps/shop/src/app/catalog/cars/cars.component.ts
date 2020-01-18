import { Component, OnInit } from '@angular/core';
import { CarsService, Car, CarsFilter } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  cars: Observable<Car[]>;
  currentFilter: CarsFilter;

  constructor(private carsService: CarsService, private router: Router) {
    this.currentFilter = DEFAULT_FILTER;
  }

  ngOnInit() {
    this.currentSize = this.colsNumber * 5;
    this.cars = this.carsService
      .getCars(0, this.currentSize)
      .pipe(map(({ data }) => data.cars));

    this.carsService.getCount().subscribe(count => {
      this.paginationLength = count.data.carsCount;
    });
  }

  paginateCars(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;
    this.currentIndex = paginationData.pageIndex;
    this.currentSize = paginationData.pageSize;

    this.cars = this.carsService
      .getCars(this.currentIndex, this.currentSize, this.currentFilter)
      .pipe(map(({ data }) => data.cars));
  }

  navigateToCar(carId: number): void {
    this.router.navigate(['catalog/car', carId]);
  }

  resetFilters(): void {
    this.currentFilter = DEFAULT_FILTER;
    this.paginateCars({
      pageSize: this.currentSize,
      pageIndex: 0,
      colsNumber: this.colsNumber
    });
    this.carsService
      .getCount()
      .subscribe(res => (this.paginationLength = res.data.carsCount));
  }

  filterCars(filter: CarsFilter): void {
    this.currentFilter = filter;
    this.currentIndex = 0;

    this.cars = this.carsService
      .getCars(this.currentIndex, this.currentSize, filter)
      .pipe(map(({ data }) => data.cars));

    this.carsService
      .getCount(filter)
      .subscribe(res => (this.paginationLength = res.data.carsCount));
  }
}
