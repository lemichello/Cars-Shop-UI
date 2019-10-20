import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationOutput } from './pagination-output';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'cars-shop-ui-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() paginationLength: number;
  @Output() paginated = new EventEmitter();
  colsNumber = 5;
  pageSize = this.colsNumber * 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [
    this.pageSize,
    this.pageSize + 5,
    this.pageSize + 10,
    this.pageSize + 15
  ];

  constructor() {}

  ngOnInit() {}

  calculatePageSize(): void {
    this.pageSize = this.colsNumber * 5;
    this.pageSizeOptions = [
      this.pageSize,
      this.pageSize + 5,
      this.pageSize + 10,
      this.pageSize + 15
    ];
  }

  getOutput(): PaginationOutput {
    return {
      pageIndex: this.pageIndex,
      colsNumber: this.colsNumber,
      pageSize: this.pageSize
    };
  }

  paginatorChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.paginated.emit(this.getOutput());
  }

  decreaseColumns(): void {
    this.colsNumber--;
    this.calculatePageSize();

    this.paginated.emit(this.getOutput());
  }

  increaseColumns(): void {
    this.colsNumber++;
    this.calculatePageSize();

    this.paginated.emit(this.getOutput());
  }
}
