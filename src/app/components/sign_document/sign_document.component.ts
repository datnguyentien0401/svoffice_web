import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BaseSearchLayout} from "../../base/layouts/BaseSearchLayout";
import {Utils} from "../../base/utils/utils";
import {RequisitionStatusEnum} from "../../_models/enums/RequisitionStatusEnum";
import {SelectModel} from "../../_models/base/select.model";
import {ServiceUtils} from "../../base/utils/service.utils";
import {UiStateService} from "../../_services/ui.state/ui.state.service";
import {ApiService} from "../../_services/api.service";
import {HttpParams} from "@angular/common/http";
import {RequisitionModel} from "../../_models/requisition.model";
import {RequisitionTypeEnum} from "../../_models/enums/RequisitionTypeEnum";
import {AuthoritiesUtils} from "../../base/utils/authorities.utils";
import {DatePipe} from "@angular/common";
import {AppSettings} from "../../app.settings";
import {Observable} from "rxjs";
import {ConfirmRequisitionComponent} from "./confirm-requesition/confirm-requisition.component";
import {MatDialog} from "@angular/material";
import {CookieService} from "ngx-cookie-service";
import {User} from "../../_models/user.model";
import {RequisitionDetailComponent} from "../requisition/requisition-detail/requisition-detail.component";

@Component({
  selector: 'app-user',
  templateUrl: './sign_document.component.html',
  styleUrls: ['./sign_document.component.scss'],
  providers: [DatePipe]
})
export class SignDocumentComponent extends BaseSearchLayout {

  moduleName = 'requisition';

  columns = [];
  buttons = [];

  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];


  constructor(protected formBuilder: FormBuilder, protected router: Router, protected apiService: ApiService, public cookieService: CookieService,
              protected utils: Utils, protected serviceUtils: ServiceUtils, protected uiStateService: UiStateService,
              protected translateService: TranslateService, private datePipe: DatePipe, public dialog: MatDialog) {
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
        title: (e: RequisitionModel) => `${e.id}`,
        cell: (e: RequisitionModel) => `${e.id}`,
        className: 'mat-column-id'
      },
      {
        columnDef: 'title', header: 'title',
        title: (e: RequisitionModel) => `${e.title}`,
        cell: (e: RequisitionModel) => `${e.title}`,
        className: 'mat-column-title'
      },
      {
        columnDef: 'type', header: 'type',
        title: (e: RequisitionModel) => `${this.utils.getEnumValueTranslated(RequisitionTypeEnum, e.type.toString())}`,
        cell: (e: RequisitionModel) => `${this.utils.getEnumValueTranslated(RequisitionTypeEnum, e.type.toString())}`,
        className: 'mat-column-type'
      },
      {
        columnDef: 'organization', header: 'organization',
        title: (e: RequisitionModel) => `${e.organization.name }`,
        cell: (e: RequisitionModel) => `${e.organization.name }`,
        className: 'mat-column-organization'
      },
      {
        columnDef: 'requisitionDate', header: 'requisitionDate',
        title: (e: RequisitionModel) => `${this.datePipe.transform(e.requisitionDate, AppSettings.DIS_DATE_FORMAT, '-0')}`,
        cell: (e: RequisitionModel) => `${this.datePipe.transform(e.requisitionDate, AppSettings.DIS_DATE_FORMAT, '-0')}`,
        className: 'mat-column-requisitionDate'
      },
      {
        columnDef: 'deadline', header: 'deadline',
        title: (e: RequisitionModel) => `${this.datePipe.transform(e.deadline, AppSettings.DIS_DATE_FORMAT, '+7')}`,
        cell: (e: RequisitionModel) => `${this.datePipe.transform(e.deadline, AppSettings.DIS_DATE_FORMAT, '+7')}`,
        className: 'mat-column-deadline'
      },
      {
        columnDef: 'status',
        header: 'status',
        title: (e: RequisitionModel) => `${this.utils.getEnumValueTranslated(RequisitionStatusEnum, e.status.toString())}`,
        cell: (e: RequisitionModel) => `${this.utils.getEnumValueTranslated(RequisitionStatusEnum, e.status.toString())}`,
        className: 'mat-column-status'
      },
      {
        columnDef: 'file', header: 'file',
        title: (e: RequisitionModel) => `${e.file.fileName}`,
        cell: (e: RequisitionModel) => `${e.file.fileName}`,
        className: 'mat-column-file'
      },
      {
        columnDef: 'reason', header: 'reason',
        title: (e: RequisitionModel) => `${e.reason ? e.reason : ''}`,
        cell: (e: RequisitionModel) => `${e.reason ? e.reason : ''}`,
        className: 'mat-column-reason'
      },
    );

    this.buttons.push(
      {
        columnDef: 'viewDetail',
        color: 'warn',
        icon: 'visibility',
        click: 'viewDetail',
        title: 'View detail',
        display: (e: User) => e && AuthoritiesUtils.hasAuthority('get/requisitions/{id}'),
      },
      {
        columnDef: 'approve',
        color: 'warn',
        icon: 'done_all',
        tooltip: 'approve',
        click: 'approve',
        title: 'Approve',
        display: (o: RequisitionModel) => AuthoritiesUtils.hasAuthority('post/requisitions/approve'),
        disabled: (o: RequisitionModel) => o.status != 1 || o.signerId != cookieService.get('username')
      },
      {
        columnDef: 'reject',
        color: 'warn',
        icon: 'clear',
        tooltip: 'reject',
        click: 'reject',
        title: 'Reject',
        display: (o: RequisitionModel) => AuthoritiesUtils.hasAuthority('put/requisitions/{id}/reject'),
        disabled: (o: RequisitionModel) => o.status != 1 || o.signerId != cookieService.get('username')
      },

    );
  }

  ngOnInit = async () => {
    this.searchForm = this.formBuilder.group({
      id: [''],
      title: [''],
      fromDate: [''],
      toDate: [''],
      status: [''],
      type: [''],
    });

    Object.keys(RequisitionStatusEnum).forEach(key => {
      const status = Utils.getEnumValue(RequisitionStatusEnum, key.replace('_', ''));

      this.translateService.get(status).subscribe(res => {
        this.statusValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });

    Object.keys(RequisitionTypeEnum).forEach(key => {
      const type = Utils.getEnumValue(RequisitionTypeEnum, key.replace('_', ''));

      this.translateService.get(type).subscribe(res => {
        this.typeValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });

    super.ngOnInit();

    this.onSubmit();

  };

  search() {
    const status = this.searchForm.get('status').value;
    const type = this.searchForm.get('type').value;
    const fromDate = this.searchForm.get('fromDate').value;
    const toDate = this.searchForm.get('toDate').value;
    const fromDateFormat = this.datePipe.transform(fromDate, AppSettings.API_DATE_FORMAT, '+7');
    const toDateFormat = this.datePipe.transform(toDate, AppSettings.API_DATE_FORMAT, '+7');

    const params = new HttpParams()
      .set('title', this.searchForm.get('title').value)
      .set('id', this.searchForm.get('id').value)
      .set('fromDate', `${fromDateFormat ? fromDateFormat : ''}`)
      .set('toDate', `${toDateFormat ? toDateFormat : ''}`)
      .set('status', `${status ? status : ''}`)
      .set('type', `${type ? type : ''}`)
      .set('isSignDoc', `${true}`);
    this._fillData('/requisitions', params);

  }

  approve(row: RequisitionModel) {
    row.isReject = false;
    this.openDialog(row).subscribe( data => {
      this.search();
    });
  }

  reject(row: RequisitionModel) {
    row.isReject = true;
    this.openDialog(row).subscribe( data => {
      this.search();
    });
  }

  openDialog(req: RequisitionModel): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmRequisitionComponent, {
      width: '50%',
      maxWidth: '50%',
      height: '70%',
      maxHeight: '70%',
      data: req ,
    });
    return dialogRef.afterClosed();
  }

  viewDetail(req: RequisitionModel){
    req.isTransferMenu = false;
    this.dialog.open(RequisitionDetailComponent, {
      width: '80%',
      maxWidth: '80%',
      height: '90%',
      maxHeight: '90%',
      data: req,
    }).afterClosed().subscribe(res => {
      this.search();
    });
  }

}
