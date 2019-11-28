import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  MatSnackBar,
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material';
import { ModelNode } from './model-node';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ModelFlatNode } from './model-flat-node';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  CarsFilter,
  CarsService,
  Color,
  ColorsService,
  EngineVolume,
  EngineVolumesService,
  VendorsService
} from '@cars-shop-ui/core-data';

@Component({
  selector: 'cars-shop-ui-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Output() filtered = new EventEmitter();
  @Output() reseted = new EventEmitter();

  colorsFormControl = new FormControl();
  colorsOptions: Color[];
  colorsFilteredOptions: Observable<Color[]>;

  engineVolumesFormControl = new FormControl();
  engineVolumesOptions: EngineVolume[];
  engineVolumesFilteredOptions: Observable<EngineVolume[]>;

  priceDateFormControl = new FormControl();

  treeControl = new FlatTreeControl<ModelFlatNode>(
    node => node.level,
    node => node.expandable
  );
  treeFlattener: MatTreeFlattener<
    ModelNode,
    { expandable: boolean; level: number; name: string }
  >;
  dataSource: MatTreeFlatDataSource<any, any>;
  checkListSelection = new SelectionModel<ModelFlatNode>(true);

  minPrice: number;
  maxPrice: number;
  maxDate = new Date(Date.now());
  fromPrice: number;
  toPrice: number;

  constructor(
    private _vendorsService: VendorsService,
    private _colorsService: ColorsService,
    private _engineVolumesService: EngineVolumesService,
    private _carsService: CarsService,
    private _snackBar: MatSnackBar
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      node => node.level,
      node => node.expandable,
      node => node.models
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
    this.dataSource.data = [];
  }

  ngOnInit() {
    this._vendorsService.getDetailed().subscribe(res => {
      this.dataSource.data = res;
    });

    this._colorsService.getAll().subscribe(res => {
      this.colorsOptions = res;

      this.colorsFilteredOptions = this.colorsFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter<Color>(value, this.colorsOptions, 'name'))
      );
    });

    this._engineVolumesService.getAll().subscribe(res => {
      this.engineVolumesOptions = res;

      this.engineVolumesFilteredOptions = this.engineVolumesFormControl.valueChanges.pipe(
        startWith(''),
        map(value =>
          this._filter<EngineVolume>(value, this.engineVolumesOptions, 'volume')
        )
      );
    });

    this._carsService.getMinMaxPrices().subscribe(res => {
      this.minPrice = res[0];
      this.maxPrice = res[1];

      this.toPrice = this.maxPrice;
      this.fromPrice = this.minPrice;
    });
  }

  private _transformer = (node: ModelNode, level: number) => {
    return {
      expandable: !!node.models && node.models.length > 0,
      name: node.name,
      level: level,
      data: node
    };
  };
  private _filter<T>(value: T | string, options: T[], prop: string): any[] {
    let filterValue: string;

    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value ? value[prop].toString().toLowerCase() : '';
    }

    return options.filter(option =>
      option[prop]
        .toString()
        .toLowerCase()
        .includes(filterValue)
    );
  }

  getLevel = (node: ModelFlatNode) => node.level;
  hasChild = (_: number, nodeData: ModelFlatNode) => nodeData.expandable;

  nodeLeafSelectionToggle(node: ModelFlatNode): void {
    this.checkListSelection.toggle(node);
    this.checkAllParentSelection(node);
  }

  checkAllParentSelection(node: ModelFlatNode): void {
    let parent: ModelFlatNode | null = this.getParentNode(node);

    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: ModelFlatNode): void {
    const nodeSelected = this.checkListSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checkListSelection.isSelected(child)
    );

    if (nodeSelected && !descAllSelected) {
      this.checkListSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checkListSelection.select(node);
    }
  }

  getParentNode(node: ModelFlatNode): ModelFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }

    return null;
  }

  descendantsAllSelected(node: ModelFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checkListSelection.isSelected(child)
    );
  }

  descendantsPartiallySelected(node: ModelFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checkListSelection.isSelected(child)
    );

    return result && !this.descendantsAllSelected(node);
  }

  nodeSelectionToggle(node: ModelFlatNode): void {
    this.checkListSelection.toggle(node);

    const descendants = this.treeControl.getDescendants(node);

    this.checkListSelection.isSelected(node)
      ? this.checkListSelection.select(...descendants)
      : this.checkListSelection.deselect(...descendants);

    descendants.every(child => this.checkListSelection.isSelected(child));
    this.checkAllParentSelection(node);
  }

  displayColorFn(color: Color): string | undefined {
    return color ? color.name : undefined;
  }

  displayEngineVolumeFn(volume: EngineVolume): string | undefined {
    return volume ? volume.volume.toString() : undefined;
  }

  displayPriceFn(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  private showSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  resetToDefaultValues(): void {
    this.treeControl.dataNodes
      .filter(x => this.checkListSelection.isSelected(x))
      .forEach(x => this.checkListSelection.deselect(x));
    this.colorsFormControl.setValue(null);
    this.engineVolumesFormControl.setValue(null);
    this.fromPrice = this.minPrice;
    this.toPrice = this.maxPrice;
    this.priceDateFormControl.setValue(null);
  }

  resetFilters(): void {
    this.resetToDefaultValues();
    this.reseted.emit();
  }

  search() {
    if (this.fromPrice > this.toPrice) {
      this.showSnackBar(
        "Minimal price shouldn't be bigger, than maximal price",
        'OK'
      );
      return;
    }

    const filter: CarsFilter = {
      colorId: this.colorsFormControl.value
        ? this.colorsFormControl.value.id
        : null,
      engineVolumeId: this.engineVolumesFormControl.value
        ? this.engineVolumesFormControl.value.id
        : null,
      modelsId: this.treeControl.dataNodes
        .filter(x => this.checkListSelection.isSelected(x))
        .map(x => x.data.id),
      price: {
        fromPrice: this.fromPrice,
        toPrice: this.toPrice,
        selectedDate: this.priceDateFormControl.value
      }
    };

    this.filtered.emit(filter);
  }
}
