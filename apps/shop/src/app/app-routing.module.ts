import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CarEditComponent } from './car-edit/car-edit.component';

const routes: Routes = [
  {
    path: 'catalog',
    loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
  },
  { path: 'car/:carId', component: CarEditComponent },
  { path: '**', redirectTo: 'catalog/cars', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
