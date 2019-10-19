import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { MaterialModule } from '@cars-shop-ui/material';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorsListComponent } from './vendors/vendors-list/vendors-list.component';

@NgModule({
  declarations: [CatalogComponent, VendorsComponent, VendorsListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    CatalogRoutingModule
  ],
  exports: [CatalogComponent, VendorsComponent]
})
export class CatalogModule { }
