import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { PaginationOutput } from './pagination-output';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'cars-shop-ui-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() paginationLength: number;
  @Input() colsNumber: number;
  @Output() paginated = new EventEmitter();
  @ViewChild('paginator') paginator: MatPaginator;
  pageSize: number;
  pageSizeOptions: number[];
  pageIndex = 0;

  constructor() {}

  ngOnInit() {
    this.pageSize = this.colsNumber * 5;
    this.refreshPageSizeOptions();
  }

  goToFirstPage(): void {
    this.paginator.firstPage();
  }

  refreshPageSizeOptions(): void {
    this.pageSizeOptions = [
      this.pageSize,
      this.pageSize + 5,
      this.pageSize + 10,
      this.pageSize + 15
    ];
  }

  calculatePageSize(): void {
    this.pageSize = this.colsNumber * 5;
    this.refreshPageSizeOptions();
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
