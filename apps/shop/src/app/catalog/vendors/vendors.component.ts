import { Component, OnInit } from '@angular/core';
import { Vendor } from './vendor';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'cars-shop-ui-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  paginationLength = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [1, 2, 3, 4, 5];
  vendors: Vendor[] = [
    {
      Id: 1,
      Name: 'Subaru'
    },
    {
      Id: 2,
      Name: 'Volkswagen'
    },
    {
      Id: 3,
      Name: 'Dodge'
    }
  ];

  constructor() {}

  ngOnInit() {}

  paginatorChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }
}
