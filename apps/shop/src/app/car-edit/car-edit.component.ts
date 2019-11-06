import { Component, Input, OnInit } from '@angular/core';
import {
  Car,
  CarsService,
  Color,
  ColorsService,
  EngineVolume,
  EngineVolumesService,
  Model,
  ModelsService,
  Vendor,
  VendorsService
} from '@cars-shop-ui/core-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'cars-shop-ui-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.scss']
})
export class CarEditComponent implements OnInit {
  @Input() car?: Car;

  vendors: Vendor[];
  models: Model[];
  colors: Color[];
  engineVolumes: EngineVolume[];
  carFormGroup: FormGroup;

  selectedVendor: Vendor;
  selectedModel: Model;
  selectedColor: Color;
  selectedEngineVolume: EngineVolume;
  description: string;
  price: number;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private vendorsService: VendorsService,
    private modelsService: ModelsService,
    private colorsService: ColorsService,
    private engineVolumesService: EngineVolumesService,
    private carsService: CarsService
  ) {
    this.carFormGroup = new FormGroup({
      vendors: new FormControl('', [Validators.required]),
      models: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      engineVolumes: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      price: new FormControl('', [
        Validators.required,
        Validators.min(1.0),
        Validators.pattern(/^[^0 a-z]\d*(.\d{2})?$/)
      ])
    });
  }

  ngOnInit() {
    this.initializeCollections();

    // TODO: add autofill when car is editing.
  }

  refreshVendors() {
    this.vendorsService.getAll().subscribe(res => {
      this.vendors = res;
    });
  }

  refreshColors() {
    this.colorsService.getAll().subscribe(res => {
      this.colors = res;
    });
  }

  refreshEngineVolumes() {
    this.engineVolumesService.getAll().subscribe(res => {
      this.engineVolumes = res;
    });
  }

  refreshModels(vendorId: number): void {
    this.modelsService.getByVendor(vendorId).subscribe(res => {
      this.models = res;
    });
  }

  initializeCollections(): void {
    this.refreshVendors();
    this.refreshColors();
    this.refreshEngineVolumes();
  }

  vendorSelected(): void {
    this.refreshModels(this.selectedVendor.id);
  }

  openInputDialog(subject: string, unit: string, callback: any): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px',
      data: { target: subject, unit: unit }
    });

    dialogRef.afterClosed().subscribe(res => {
      callback(res);
    });
  }

  addVendor(vendorName: string) {
    if (!vendorName) {
      return;
    }

    this.vendorsService.add(vendorName).subscribe(() => {
      this.refreshVendors();
    });
  }

  validateVendorSelection(): void {
    if (!this.selectedVendor) {
      alert('You need to select vendor, for which you want to add a model');
      return;
    }

    this.openInputDialog('Model', 'name', this.addModel.bind(this));
  }

  addModel(modelName: string) {
    if (!modelName) {
      return;
    }

    this.modelsService
      .add({
        name: modelName,
        vendorId: this.selectedVendor.id
      })
      .subscribe(() => {
        this.refreshModels(this.selectedVendor.id);
      });
  }

  addColor(colorName: string) {
    if (!colorName) {
      return;
    }

    this.colorsService.add(colorName).subscribe(() => {
      this.refreshColors();
    });
  }

  addEngineVolume(engineVolume: string) {
    const engineVolumeValue = Number(engineVolume);

    if (Number.isNaN(engineVolumeValue)) {
      alert('You entered incorrect value of engine volume. Try again.');
      return;
    }

    this.engineVolumesService.add(engineVolumeValue).subscribe(() => {
      this.refreshEngineVolumes();
    });
  }

  addCar() {
    this.carsService
      .add({
        modelId: this.selectedModel.id,
        colorId: this.selectedColor.id,
        engineVolumeId: this.selectedEngineVolume.id,
        description: this.description,
        price: this.price
      })
      .subscribe(() => {
        this.router.navigate(['catalog/cars']);
      });
  }
}
