import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CarEditComponent } from './car-edit/car-edit.component';

const routes: Routes = [
  {
    path: 'catalog',
    loadChildren: './catalog/catalog.module#CatalogModule'
  },
  { path: 'car', component: CarEditComponent },
  { path: '**', redirectTo: 'catalog', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
