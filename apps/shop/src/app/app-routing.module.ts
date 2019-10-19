import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { VendorsComponent } from './catalog/vendors/vendors.component';

const routes: Routes = [
  {
    path: 'catalog',
    loadChildren: './catalog/catalog.module#CatalogModule'
  },
  { path: '**', redirectTo: 'catalog', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
