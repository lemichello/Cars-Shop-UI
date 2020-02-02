import { Component, OnInit } from '@angular/core';
import { DetailedVendor, VendorsService } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { Router } from '@angular/router';

@Component({
  selector: 'cars-shop-ui-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  colsNumber = 5;
  currentIndex: number;
  currentSize: number;
  paginationLength: number;
  vendors: DetailedVendor[];
  paginatedVendors: DetailedVendor[];

  constructor(private vendorsService: VendorsService, private router: Router) {
    this.currentIndex = 0;
    this.currentSize = this.colsNumber * 5;
  }

  ngOnInit() {
    this.vendorsService.getDetailed().subscribe(res => {
      this.vendors = res.data.vendors;

      const startIndex = this.currentIndex * this.currentSize;
      const endIndex = startIndex + this.currentSize;

      this.paginatedVendors = this.vendors.slice(startIndex, endIndex);
      this.paginationLength = this.vendors.length;
    });
  }

  paginateVendors(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;
    this.currentIndex = paginationData.pageIndex;
    this.currentSize = paginationData.pageSize;

    const startIndex = this.currentIndex * this.currentSize;
    const endIndex = startIndex + this.currentSize;

    this.paginatedVendors = this.vendors.slice(startIndex, endIndex);
  }

  async navigateToModel(vendorId: number): Promise<void> {
    await this.router.navigate(['catalog/models', vendorId]);
  }
}
