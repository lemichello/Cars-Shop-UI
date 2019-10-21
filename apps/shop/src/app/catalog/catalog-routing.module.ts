import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ModelsComponent } from './models/models.component';
import { CarsComponent } from './cars/cars.component';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    children: [
      { path: 'vendors', component: VendorsComponent },
      { path: 'models/:vendorId', component: ModelsComponent },
      { path: 'cars', component: CarsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule {}
