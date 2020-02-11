import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@cars-shop-ui/material';
import { AppRoutingModule } from './app-routing.module';
import { CatalogModule } from './catalog/catalog.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreDataModule } from '@cars-shop-ui/core-data';
import { CarEditComponent } from './car-edit/car-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputDialogComponent } from './car-edit/input-dialog/input-dialog.component';
import { ApolloModule } from 'apollo-angular';

@NgModule({
  declarations: [AppComponent, CarEditComponent, InputDialogComponent],
  entryComponents: [InputDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    CatalogModule,
    CoreDataModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ApolloModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
