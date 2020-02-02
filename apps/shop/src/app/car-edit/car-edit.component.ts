import { Component, OnInit } from '@angular/core';
import {
  Car,
  CarsService,
  Color,
  ColorsService,
  DetailedVendor,
  EngineVolume,
  EngineVolumesService,
  Model,
  ModelsService,
  VendorsService
} from '@cars-shop-ui/core-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cars-shop-ui-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.scss']
})
export class CarEditComponent implements OnInit {
  carId?: number;
  car?: Car;

  vendors: DetailedVendor[];
  models: Model[];
  colors: Color[];
  engineVolumes: EngineVolume[];
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

  async ngOnInit() {
    await this.initializeCollections();

    this.route.params.subscribe(async params => {
      if (params['carId'] && params['carId'] !== 'new') {
        this.carId = +params['carId'];
        await this.initializeCar();
      } else {
        this.carId = undefined;
        this.carFormGroup.controls['vendors'].setValue('');
        this.carFormGroup.controls['models'].setValue('');
        this.carFormGroup.controls['engineVolumes'].setValue('');
        this.carFormGroup.controls['colors'].setValue('');
        this.description = '';
        this.price = undefined;
      }
    });
  }

  async initializeCollections(): Promise<void> {
    await this.refreshVendors();
    await this.refreshColors();
    await this.refreshEngineVolumes();
  }

  async initializeCar(): Promise<void> {
    await this.carsService.getCarForEdit(this.carId).subscribe(async res => {
      this.car = res.data.car;
      await this.selectFieldsOfCar();
    });
  }

  async selectFieldsOfCar(): Promise<void> {
    this.carFormGroup.controls['vendors'].setValue(
      this.vendors.find(x => x.id === this.car.model.vendorId).id
    );
    this.selectedVendorId = this.car.model.vendorId;
    await this.vendorSelected();
    this.carFormGroup.controls['models'].setValue(
      this.models.find(x => x.id === this.car.model.id).id
    );
    this.selectedModelId = this.car.model.id;

    this.carFormGroup.controls['engineVolumes'].setValue(
      this.engineVolumes.find(x => x.id === this.car.engineVolume.id).id
    );
    this.selectedEngineVolumeId = this.car.engineVolume.id;

    this.carFormGroup.controls['colors'].setValue(
      this.colors.find(x => x.id === this.car.color.id).id
    );
    this.selectedColorId = this.car.color.id;

    this.description = this.car.description;
    this.price = this.car.price;
  }

  async refreshVendors(): Promise<void> {
    await this.vendorsService
      .getDetailed()
      .subscribe(x => (this.vendors = x.data.vendors));
  }

  async refreshColors(): Promise<void> {
    await this.colorsService
      .getAll()
      .subscribe(x => (this.colors = x.data.colors));
  }

  async refreshEngineVolumes(): Promise<void> {
    await this.engineVolumesService
      .getAll()
      .subscribe(x => (this.engineVolumes = x.data.engineVolumes));
  }

  async refreshModels(vendorId: number): Promise<void> {
    this.models = this.vendors.find(v => v.id === vendorId).models;
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  async vendorSelected(): Promise<void> {
    await this.refreshModels(
      this.selectedVendorId ? this.selectedVendorId : this.car.model.vendorId
    );
  }

  openInputDialog(subject: string, unit: string, callback: any): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px',
      data: { target: subject, unit: unit }
    });

    dialogRef.afterClosed().subscribe(async res => {
      await callback(res);
    });
  }

  async addVendor(vendorName: string): Promise<void> {
    if (!vendorName) {
      return;
    }

    await this.vendorsService.add(vendorName).subscribe(async () => {
      await this.refreshVendors();
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
      .subscribe(async () => {
        await this.refreshModels(this.selectedVendorId);
      });
  }

  async addColor(colorName: string): Promise<void> {
    if (!colorName) {
      return;
    }

    await this.colorsService.add(colorName).subscribe(async () => {
      await this.refreshColors();
    });
  }

  async addEngineVolume(engineVolume: string): Promise<void> {
    if (engineVolume === undefined) {
      return;
    }

    const engineVolumeValue = Number(engineVolume);

    if (Number.isNaN(engineVolumeValue)) {
      this.openSnackBar('You entered incorrect value of engine volume', 'OK');
      return;
    }

    await this.engineVolumesService
      .add(engineVolumeValue)
      .subscribe(async () => {
        await this.refreshEngineVolumes();
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
        description: this.description || null,
        price: this.price,
        id: 0
      })
      .subscribe(async () => {
        this.openSnackBar('Successfully added', 'OK');
        await this.router.navigate(['catalog/cars']);
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
        price: this.price
      })
      .subscribe(async () => {
        this.openSnackBar('Successfully updated', 'OK');
        await this.router.navigate(['catalog/car', this.car.id]);
      });
  }

  async cancelEdit() {
    if (this.carId) {
      await this.router.navigate(['catalog/car', this.carId]);
    } else {
      await this.router.navigate(['catalog/cars']);
    }
  }
}
