import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { MaterialModule } from '@cars-shop-ui/material';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorsListComponent } from './vendors/vendors-list/vendors-list.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ModelsComponent } from './models/models.component';
import { ModelsListComponent } from './models/models-list/models-list.component';
import { CarsComponent } from './cars/cars.component';
import { CarsListComponent } from './cars/cars-list/cars-list.component';

@NgModule({
  declarations: [
    CatalogComponent,
    VendorsComponent,
    VendorsListComponent,
    PaginatorComponent,
    ModelsComponent,
    ModelsListComponent,
    CarsComponent,
    CarsListComponent
  ],
  imports: [CommonModule, MaterialModule, CatalogRoutingModule],
  exports: [CatalogComponent, VendorsComponent, VendorsListComponent]
})
export class CatalogModule {}
