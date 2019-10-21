import { Component, OnInit } from '@angular/core';
import { Vendor, VendorsService } from '@cars-shop-ui/core-data';
import { PaginationOutput } from '../paginator/pagination-output';
import { Router } from '@angular/router';
import { PaginationService } from '../paginator/pagination.service';

@Component({
  selector: 'cars-shop-ui-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  colsNumber = 5;
  paginationLength: number;
  vendors: any;
  displayVendors: Vendor[];

  constructor(private vendorsService: VendorsService, private router: Router) {}

  ngOnInit() {
    this.vendorsService.getAll().subscribe(res => {
      this.vendors = res;
      this.paginationLength = this.vendors.length;

      this.paginateVendors({
        colsNumber: this.colsNumber,
        pageIndex: 0,
        pageSize: this.colsNumber * 5
      });
    });
  }

  paginateVendors(paginationData: PaginationOutput): void {
    this.colsNumber = paginationData.colsNumber;

    this.displayVendors = PaginationService.paginate(
      paginationData,
      this.vendors
    );
  }

  navigateToModel(vendorId: number): void {
    this.router.navigate(['catalog/models', vendorId]);
  }
}
