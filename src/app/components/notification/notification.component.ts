import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BaseSearchLayout} from "../../base/layouts/BaseSearchLayout";
import {Utils} from "../../base/utils/utils";
import {SelectModel} from "../../_models/base/select.model";
import {ServiceUtils} from "../../base/utils/service.utils";
import {UiStateService} from "../../_services/ui.state/ui.state.service";
import {ApiService} from "../../_services/api.service";
import {HttpParams} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {AppSettings} from "../../app.settings";
import {NotificationModel} from "../../_models/notification.model";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [DatePipe]
})
export class NotificationComponent extends BaseSearchLayout {

  moduleName = 'notification';

  columns = [];
  buttons = [];

  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];


  constructor(protected formBuilder: FormBuilder, protected router: Router, protected apiService: ApiService,
              protected utils: Utils, protected serviceUtils: ServiceUtils, protected uiStateService: UiStateService,
              protected translateService: TranslateService, private datePipe: DatePipe) {
    super(router, apiService, utils, serviceUtils, uiStateService, translateService);
    this.columns.push(
      {
        columnDef: 'stt',
        header: 'stt',
        title: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
        cell: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
        className: 'mat-column-stt'
      },
      {
        columnDef: 'id', header: 'id',
        title: (e: NotificationModel) => `${e.id}`,
        cell: (e: NotificationModel) => `${e.id}`,
        className: 'mat-column-id'
      },
      {
        columnDef: 'content', header: 'content',
        title: (e: NotificationModel) => `${e.content}`,
        cell: (e: NotificationModel) => `${e.content}`,
        className: 'mat-column-content'
      },
      {
        columnDef: 'createDate', header: 'createDate',
        title: (e: NotificationModel) => `${this.datePipe.transform(e.createDate, AppSettings.DIS_DATE_FORMAT, '-0')}`,
        cell: (e: NotificationModel) => `${this.datePipe.transform(e.createDate, AppSettings.DIS_DATE_FORMAT, '-0')}`,
        className: 'mat-column-createDate'
      },
      {
        columnDef: 'deadline', header: 'deadline',
        title: (e: NotificationModel) => e.deadline ?
          `${this.datePipe.transform(e.deadline, AppSettings.DIS_DATE_FORMAT, '+7')}`
          : '',
        cell: (e: NotificationModel) => e.deadline ?
          `${this.datePipe.transform(e.deadline, AppSettings.DIS_DATE_FORMAT, '+7')}`
          : '',
        className: 'mat-column-deadline'
      },
      {
        columnDef: 'sender', header: 'sender',
        title: (e: NotificationModel) => `${e.sender ? e.sender : ''}`,
        cell: (e: NotificationModel) => `${e.sender ? e.sender : ''}`,
        className: 'mat-column-sender'
      },
    );

  }

  ngOnInit = async () => {
    this.searchForm = this.formBuilder.group({
      createDateFrom: [''],
      createDateTo: [''],
      deadlineFrom: [''],
      deadlineTo: [''],
    });

    super.ngOnInit();

    this.onSubmit();

  };

  search() {
    const createDateFrom = this.searchForm.get('createDateFrom').value;
    const createDateTo = this.searchForm.get('createDateTo').value;
    const deadlineFrom = this.searchForm.get('deadlineFrom').value;
    const deadlineTo = this.searchForm.get('deadlineTo').value;

    const createDateFromStr = this.datePipe.transform(createDateFrom, AppSettings.API_DATE_FORMAT, '+7');
    const createDateToStr = this.datePipe.transform(createDateTo, AppSettings.API_DATE_FORMAT, '+7');
    const deadlineFromStr = this.datePipe.transform(deadlineFrom, AppSettings.API_DATE_FORMAT, '+7');
    const deadlineToStr = this.datePipe.transform(deadlineTo, AppSettings.API_DATE_FORMAT, '+7');

    const params = new HttpParams()
      .set('createDateFrom', `${createDateFromStr ? createDateFromStr : ''}`)
      .set('createDateTo', `${createDateToStr ? createDateToStr : ''}`)
      .set('deadlineFrom', `${deadlineFromStr ? deadlineFromStr : ''}`)
      .set('deadlineTo', `${deadlineToStr ? deadlineToStr : ''}`);
    this._fillData('/notifications', params);

  }

}
