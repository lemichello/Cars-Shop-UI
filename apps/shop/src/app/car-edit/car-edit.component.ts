import { Component, OnInit } from '@angular/core';
import {
  CarsService,
  Color,
  ColorsService,
  EditCarDto,
  EngineVolume,
  EngineVolumesService,
  Model,
  ModelsService,
  Vendor,
  VendorsService
} from '@cars-shop-ui/core-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'cars-shop-ui-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.scss']
})
export class CarEditComponent implements OnInit {
  carId?: number;
  car?: EditCarDto;

  vendors: Observable<Vendor[]>;
  models: Observable<Model[]>;
  colors: Observable<Color[]>;
  engineVolumes: Observable<EngineVolume[]>;
  carFormGroup: FormGroup;

  selectedVendorId: number;
  selectedModelId: number;
  selectedColorId: number;
  selectedEngineVolumeId: number;
  description: string;
  price: number;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private vendorsService: VendorsService,
    private modelsService: ModelsService,
    private colorsService: ColorsService,
    private engineVolumesService: EngineVolumesService,
    private carsService: CarsService
  ) {
    this.carFormGroup = new FormGroup({
      vendors: new FormControl('', [Validators.required]),
      models: new FormControl('', [Validators.required]),
      colors: new FormControl('', [Validators.required]),
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

    this.route.params.subscribe(params => {
      if (params['carId'] && params['carId'] !== 'new') {
        this.carId = +params['carId'];
        this.initializeCar();
      }
    });
  }

  initializeCar(): void {
    this.carsService.getSimplified(this.carId).subscribe(res => {
      this.car = res;
      this.selectFieldsOfCar();
    });
  }

  selectFieldsOfCar(): void {
    this.vendors.subscribe(vendors => {
      this.carFormGroup.controls['vendors'].setValue(
        vendors.find(x => x.id === this.car.model.vendorId).id
      );
      this.selectedVendorId = this.car.model.vendorId;
      this.vendorSelected();

      this.models.subscribe(models => {
        this.carFormGroup.controls['models'].setValue(
          models.find(x => x.id === this.car.modelId).id
        );
        this.selectedModelId = this.car.modelId;
      });
    });

    this.engineVolumes.subscribe(res => {
      this.carFormGroup.controls['engineVolumes'].setValue(
        res.find(x => x.id === this.car.engineVolumeId).id
      );
      this.selectedEngineVolumeId = this.car.engineVolumeId;
    });

    this.colors.subscribe(res => {
      this.carFormGroup.controls['colors'].setValue(
        res.find(x => x.id === this.car.colorId).id
      );
      this.selectedColorId = this.car.colorId;
    });

    this.description = this.car.description;
    this.price = this.car.price;
  }

  refreshVendors(): void {
    this.vendors = this.vendorsService.getAll();
  }

  refreshColors(): void {
    this.colors = this.colorsService.getAll();
  }

  refreshEngineVolumes(): void {
    this.engineVolumes = this.engineVolumesService.getAll();
  }

  refreshModels(vendorId: number): void {
    this.models = this.modelsService.getByVendor(vendorId);
  }

  initializeCollections(): void {
    this.refreshVendors();
    this.refreshColors();
    this.refreshEngineVolumes();
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  vendorSelected(): void {
    this.refreshModels(
      this.selectedVendorId ? this.selectedVendorId : this.car.model.vendorId
    );
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

  addVendor(vendorName: string): void {
    if (!vendorName) {
      return;
    }

    this.vendorsService.add(vendorName).subscribe(() => {
      this.refreshVendors();
    });
  }

  validateVendorSelection(): void {
    if (!this.selectedVendorId) {
      this.openSnackBar(
        'You need to select vendor, for which you want to add a model',
        'OK'
      );
      return;
    }

    this.openInputDialog('Model', 'name', this.addModel.bind(this));
  }

  addModel(modelName: string): void {
    if (!modelName) {
      return;
    }

    this.modelsService
      .add({
        name: modelName,
        vendorId: this.selectedVendorId
      })
      .subscribe(() => {
        this.refreshModels(this.selectedVendorId);
      });
  }

  addColor(colorName: string): void {
    if (!colorName) {
      return;
    }

    this.colorsService.add(colorName).subscribe(() => {
      this.refreshColors();
    });
  }

  addEngineVolume(engineVolume: string): void {
    const engineVolumeValue = Number(engineVolume);

    if (Number.isNaN(engineVolumeValue)) {
      this.openSnackBar('You entered incorrect value of engine volume', 'OK');
      return;
    }

    this.engineVolumesService.add(engineVolumeValue).subscribe(() => {
      this.refreshEngineVolumes();
    });
  }

  saveCar(): void {
    if (this.carId) {
      this.updateCar();
    } else {
      this.addCar();
    }
  }

  addCar() {
    this.carsService
      .add({
        modelId: this.selectedModelId,
        colorId: this.selectedColorId,
        engineVolumeId: this.selectedEngineVolumeId,
        description: this.description,
        price: this.price
      })
      .subscribe(() => {
        this.openSnackBar('Successfully added', 'OK');
        this.router.navigate(['catalog/cars']);
      });
  }

  updateCar() {
    this.carsService
      .update({
        id: this.car.id,
        modelId: this.selectedModelId,
        engineVolumeId: this.selectedEngineVolumeId,
        colorId: this.selectedColorId,
        description: this.description,
        price: this.price,
        model: null
      })
      .subscribe(() => {
        this.openSnackBar('Successfully updated', 'OK');
        this.router.navigate(['catalog/car', this.car.id]);
      });
  }
}
