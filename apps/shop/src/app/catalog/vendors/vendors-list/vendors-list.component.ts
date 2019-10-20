import { Component, Input, OnInit } from '@angular/core';
import { Vendor } from '@cars-shop-ui/core-data';

@Component({
  selector: 'cars-shop-ui-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss']
})
export class VendorsListComponent implements OnInit {
  @Input() vendors: Vendor[];
  @Input() cols: number;

  constructor() {}

  ngOnInit() {}
}
