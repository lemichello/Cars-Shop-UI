import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { VendorsService } from './vendors/vendors.service';
import { LoaderComponent } from './loader/loader.component';
import { MaterialModule } from '@cars-shop-ui/material';
import { LoaderInterceptor } from './loader/loader.interceptor';

@NgModule({
  imports: [CommonModule, HttpClientModule, MaterialModule],
  providers: [
    VendorsService,
    VendorsService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  exports: [LoaderComponent],
  declarations: [LoaderComponent]
})
export class CoreDataModule {}
