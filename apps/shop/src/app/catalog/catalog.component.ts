import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { CarsFilter } from '@cars-shop-ui/core-data';
import { CarsComponent } from './cars/cars.component';

@Component({
  selector: 'cars-shop-ui-home',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  carsComponent: CarsComponent;

  constructor(public router: Router) {
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.sidenav.opened = false;
      }
    });
  }

  ngOnInit() {}

  filteredCars(filter: CarsFilter): void {
    this.carsComponent.filterCars(filter);
  }

  resetedFilters(): void {
    this.carsComponent.resetFilters();
  }

  onRouterOutletActivate(component: any) {
    if (component instanceof CarsComponent) {
      this.carsComponent = component;
    }
  }
}
