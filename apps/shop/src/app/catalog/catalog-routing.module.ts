import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { VendorsComponent } from './vendors/vendors.component';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    children: [{ path: 'vendors', component: VendorsComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule {}
