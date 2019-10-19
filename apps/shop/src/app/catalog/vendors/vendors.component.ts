import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { VendorsService } from '@cars-shop-ui/core-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'cars-shop-ui-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  paginationLength = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [1, 2, 3, 4, 5];
  vendors;

  constructor(private vendorsService: VendorsService) {}

  ngOnInit() {
    this.vendors = this.vendorsService.getAll();
  }

  paginatorChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
  }
}
