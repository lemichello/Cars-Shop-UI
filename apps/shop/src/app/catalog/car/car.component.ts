import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarsService, DetailedCar } from '@cars-shop-ui/core-data';

@Component({
  selector: 'cars-shop-ui-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  carId: number;
  car: DetailedCar;
  priceHistoryIndex: number;

  constructor(
    private carsService: CarsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.carId = +params['carId'];
    });

    this.carsService.getById(this.carId).subscribe(
      res => {
        this.car = res.body;
        this.priceHistoryIndex = this.car.pricesHistory.length - 1;
      },
      () => {
        alert('Not found a requesting car');
        this.router.navigate(['catalog/cars']);
      }
    );
  }
}
