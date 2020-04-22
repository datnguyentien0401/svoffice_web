import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppSettings} from '../../app.settings';
import {MatPaginatorIntl} from '@angular/material';
import {MultilanguagePanigator} from './multilanguage.paginator';
import {Paging} from '../../_models/base/Paging';
import {ButtonClickModel} from '../../_models/base/button.click.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [
    {provide: MatPaginatorIntl, useClass: MultilanguagePanigator}
  ]
})
export class TableComponent implements OnInit {

  @Input() moduleName;
  varPaging: Paging;

  @Input() set paging(value: Paging) {
    if (value) {
      this.varPaging = value;
    }
  }

  @Input() results;
  @Input() columns;
  @Input() buttons;
  pageSizeOptions: number[];

  @Output() pagingChange = new EventEmitter<Paging>(true);
  @Output() clickAction = new EventEmitter<ButtonClickModel>();

  constructor() {
    this.pageSizeOptions = AppSettings.PAGE_SIZE_OPTIONS;
  }

  getPage(pageable: any) {
    this.varPaging.pageNumber = pageable.pageIndex + 1;
    this.varPaging.pageSize = pageable.pageSize;
    this.pagingChange.emit(this.varPaging);
  }

  get displayedColumns(): string[] {
    let columnsDef = this.columns.map(c => c.columnDef);
    if (this.buttons) {
      columnsDef = columnsDef.concat(this.buttons.map(b => b.columnDef));
    }
    return columnsDef;
  }

  onClick(action: string, result: any) {
    const buttonClickModel = new ButtonClickModel(action, result);
    this.clickAction.emit(buttonClickModel);
  }

  ngOnInit(): void {
    if (!this.varPaging) {
      this.varPaging = new Paging();
      this.varPaging.pageSize = AppSettings.PAGE_SIZE;
      this.varPaging.pageNumber = 1;
      this.varPaging.totalElements = 0;
      this.pagingChange.emit(this.varPaging);
    }
  }

  getClassName(column: any, result: any): string {
    return (typeof column.className === 'function') ? column.className(result) : (column.className ? column.className : "");
  }
}
