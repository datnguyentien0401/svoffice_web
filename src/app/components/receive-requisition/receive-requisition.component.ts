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
import {MatDialog} from "@angular/material";
import {RequisitionDetailComponent} from "../requisition/requisition-detail/requisition-detail.component";
import {TransferRequisitionComponent} from "../requisition/transfer-requisition/transfer-requisition.component";

@Component({
  selector: 'app-receive-requisition',
  templateUrl: './receive-requisition.component.html',
  styleUrls: ['./receive-requisition.component.scss'],
  providers: [DatePipe]
})
export class ReceiveRequisitionComponent extends BaseSearchLayout {

  moduleName = 'requisition';

  columns = [];
  buttons = [];

  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];


  constructor(protected formBuilder: FormBuilder, protected router: Router, protected apiService: ApiService,
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
        columnDef: 'id', header: 'id', title: (e: RequisitionModel) => `${e.id}`,
        cell: (e: RequisitionModel) => `${e.id}`,
        className: 'mat-column-id'
      },
      {
        columnDef: 'code', header: 'code', title: (e: RequisitionModel) => `${e.code}`,
        cell: (e: RequisitionModel) => `${e.code}`,
        className: 'mat-column-id'
      },
      {
        columnDef: 'title', header: 'title', title: (e: RequisitionModel) => `${e.title}`,
        cell: (e: RequisitionModel) => `${e.title}`,
        className: 'mat-column-title'
      },
      {
        columnDef: 'type', header: 'type',
        title: (e: RequisitionModel) => `${this.utils.getEnumValueTranslated(RequisitionTypeEnum, e.type.toString())}`,
        cell: (e: RequisitionModel) => `${this.utils.getEnumValueTranslated(RequisitionTypeEnum, e.type.toString())}`,
        className: 'mat-column-lastName'
      },
      {
        columnDef: 'signer', header: 'signer',
        title: (e: RequisitionModel) => `${e.signer.lastName + ' ' + e.signer.firstName}`,
        cell: (e: RequisitionModel) => `${e.signer.lastName + ' ' + e.signer.firstName}`,
        className: 'mat-column-signer'
      },
      {
        columnDef: 'transferUser', header: 'transferUser',
        title: (e: RequisitionModel) => `${e.transferUser}`,
        cell: (e: RequisitionModel) => `${e.transferUser}`,
        className: 'mat-column-transferUser'
      },
      {
        columnDef: 'transferDate', header: 'transferDate',
        title: (e: RequisitionModel) => `${this.datePipe.transform(e.transferDate, AppSettings.DIS_DATE_FORMAT, '-0')}`,
        cell: (e: RequisitionModel) => `${this.datePipe.transform(e.transferDate, AppSettings.DIS_DATE_FORMAT, '-0')}`,
        className: 'mat-column-transferDate'
      },
      {
        columnDef: 'transferComment', header: 'transferComment',
        title: (e: RequisitionModel) => `${e.transferComment }`,
        cell: (e: RequisitionModel) => `${e.transferComment }`,
        className: 'mat-column-reason'
      },
      {
        columnDef: 'file', header: 'file',
        title: (e: RequisitionModel) => `${e.file.fileName}`,
        cell: (e: RequisitionModel) => `${e.file.fileName}`,
        className: 'mat-column-file'
      },

    );

    this.buttons.push(
      {
        columnDef: 'viewDetail',
        color: 'warn',
        icon: 'visibility',
        click: 'viewDetail',
        display: (e: RequisitionModel) => e && AuthoritiesUtils.hasAuthority('get/requisitions/{id}'),
      },
      {
        columnDef: 'verify',
        color: 'warn',
        icon: 'security',
        click: 'verify',
        display: (e: RequisitionModel) => e && AuthoritiesUtils.hasAuthority('get/requisitions/{id}'),
      },
      // {
      //   columnDef: 'transfer',
      //   color: 'warn',
      //   icon: 'send',
      //   tooltip: 'transfer',
      //   click: 'transfer',
      //   display: (o: RequisitionModel) => AuthoritiesUtils.hasAuthority('put/requisitions/{id}/transfer'),
      //   disabled: (o: RequisitionModel) => o.status != 2 && o.status !=5
      // },
    );
  }

  ngOnInit = async () => {
    this.searchForm = this.formBuilder.group({
      code: [''],
      title: [''],
      fromDate: [''],
      toDate: [''],
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
    const type = this.searchForm.get('type').value;
    const fromDate = this.searchForm.get('fromDate').value;
    const toDate = this.searchForm.get('toDate').value;
    const fromDateFormat = this.datePipe.transform(fromDate, AppSettings.API_DATE_FORMAT, '+7');
    const toDateFormat = this.datePipe.transform(toDate, AppSettings.API_DATE_FORMAT, '+7');

    const params = new HttpParams()
      .set('title', this.searchForm.get('title').value)
      .set('code', this.searchForm.get('code').value)
      .set('fromDate', `${fromDateFormat ? fromDateFormat : ''}`)
      .set('toDate', `${toDateFormat ? toDateFormat : ''}`)
      .set('type', `${type ? type : ''}`);
    this._fillData('/requisitions/receive-document', params);

  }

  transfer(req: RequisitionModel): void{
    this.dialog.open(TransferRequisitionComponent, {
      width: '60%',
      maxWidth: '60%',
      height: '80%',
      maxHeight: '80%',
      data: req,
    });
    this.search();
  }

  viewDetail(req: RequisitionModel):  Observable<any> {
    req.isTransferMenu = true;
    const dialogRef = this.dialog.open(RequisitionDetailComponent, {
      width: '80%',
      maxWidth: '80%',
      height: '90%',
      maxHeight: '90%',
      data: req,
    });
    return dialogRef.afterClosed();

  }

  verify(row: RequisitionModel) {
    this.serviceUtils.execute(this.apiService.post('/requisitions/' + row.id + '/verify', null),
      this.onSuccessFunc, this.moduleName + '.success.verify',
      this.moduleName + '.confirm.verify');
  }

}
