import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '@cars-shop-ui/core-data';

@Component({
  selector: 'cars-shop-ui-cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.scss']
})
export class CarsListComponent implements OnInit {
  @Input() cols: number;
  @Input() cars: Car[];
  @Output() selectedCar = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
