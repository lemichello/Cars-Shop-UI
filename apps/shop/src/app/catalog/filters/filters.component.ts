import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { ModelNode } from './model-node';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ModelFlatNode } from './model-flat-node';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VendorsService } from '@cars-shop-ui/core-data';

@Component({
  selector: 'cars-shop-ui-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  colorsFormControl = new FormControl();
  colorsFilteredOptions: Observable<string[]>;

  colorsOptions: string[] = ['One', 'Two', 'Three'];
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

  constructor(private _vendorsService: VendorsService) {
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

    this.colorsFilteredOptions = this.colorsFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.colorsOptions))
    );
  }

  ngOnInit() {
    this._vendorsService.getDetailed().subscribe(res => {
      this.dataSource.data = res;
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
  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().includes(filterValue));
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

  search() {
    console.log(
      this.treeControl.dataNodes.filter(x =>
        this.checkListSelection.isSelected(x)
      )
    );
  }
}
