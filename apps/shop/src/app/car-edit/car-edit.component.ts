import { Component, Input, OnInit } from '@angular/core';
import {
  Car,
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

  vendorsControl = new FormControl('', [Validators.required]);
  modelsControl = new FormControl('', [Validators.required]);
  descriptionControl = new FormControl('', [Validators.required]);
  carFormGroup: FormGroup = new FormGroup({
    vendors: this.vendorsControl,
    models: this.modelsControl,
    description: this.descriptionControl
  });

  selectedVendor: Vendor;

  constructor(
    private vendorsService: VendorsService,
    private modelsService: ModelsService,
    private colorsService: ColorsService,
    private engineVolumesService: EngineVolumesService
  ) {}

  ngOnInit() {
    this.initializeCollections();

    // TODO: add autofill when car is editing.
  }

  initializeCollections(): void {
    this.vendorsService.getAll().subscribe(res => {
      this.vendors = res;
    });

    this.colorsService.getAll().subscribe(res => {
      this.colors = res;
    });

    this.engineVolumesService.getAll().subscribe(res => {
      this.engineVolumes = res;
    });
  }

  vendorSelected(): void {
    this.modelsService.getByVendor(this.selectedVendor.id).subscribe(res => {
      this.models = res;
    });
  }
}
