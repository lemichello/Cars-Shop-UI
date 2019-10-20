import { Component, Input, OnInit } from '@angular/core';
import { Model } from '@cars-shop-ui/core-data';

@Component({
  selector: 'cars-shop-ui-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.scss']
})
export class ModelsListComponent implements OnInit {
  @Input() models: Model[];
  @Input() cols: number;

  constructor() {}

  ngOnInit() {}
}
