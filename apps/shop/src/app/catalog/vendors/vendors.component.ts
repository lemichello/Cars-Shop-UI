import { Component, OnInit } from '@angular/core';
import { Vendor, VendorsService } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { Router } from '@angular/router';

@Component({
  selector: 'cars-shop-ui-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  colsNumber = 5;
  paginationLength: number;
  vendors: Vendor[];

  constructor(private vendorsService: VendorsService, private router: Router) {}

  ngOnInit() {
    this.vendorsService.getAll(0, this.colsNumber * 5).subscribe(res => {
      this.vendors = res.data.vendors;
      this.vendorsService.getCount().subscribe(count => {
        this.paginationLength = count.data.vendorsCount;
      });
    });
  }

  paginateVendors(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;

    this.vendorsService
      .getAll(paginationData.pageIndex, paginationData.pageSize)
      .subscribe(res => {
        this.vendors = res.data.vendors;
      });
  }

  navigateToModel(vendorId: number): void {
    this.router.navigate(['catalog/models', vendorId]);
  }
}
