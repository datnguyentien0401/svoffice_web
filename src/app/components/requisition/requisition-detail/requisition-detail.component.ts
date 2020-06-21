import {Component, Inject} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {DatePipe, Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from "../../../_services/api.service";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {BaseAddEditLayout} from "../../../base/layouts/BaseAddEditLayout";
import {Utils} from "../../../base/utils/utils";
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {SelectModel} from "../../../_models/base/select.model";
import {RequisitionTypeEnum} from "../../../_models/enums/RequisitionTypeEnum";
import {RequisitionModel} from "../../../_models/requisition.model";
import {User} from "../../../_models/user.model";
import {AutocompleteModel} from "../../../_models/base/autocomplete.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileModel} from "../../../_models/file.model";
import {AppSettings} from "../../../app.settings";
import {RequisitionStatusEnum} from "../../../_models/enums/RequisitionStatusEnum";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {SignDocumentComponent} from "../../sign_document/sign_document.component";
import {TransferRequisitionComponent} from "../transfer-requisition/transfer-requisition.component";
import {Observable} from "rxjs";
import {ConfirmRequisitionComponent} from "../../sign_document/confirm-requesition/confirm-requisition.component";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-organization-detail',
  templateUrl: './requisition-detail.component.html',
  styleUrls: ['./requisition-detail.component.scss'],
  providers: [DatePipe]
})
export class RequisitionDetailComponent extends BaseAddEditLayout {
  moduleName = 'requisition.ae.';

  title: string;
  fileName: string;

  urlDownload: string;

  receivers: string;


  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location, private http: HttpClient,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              private datePipe: DatePipe, public dialogRef: MatDialogRef<SignDocumentComponent>, private cookieService: CookieService,
              @Inject(MAT_DIALOG_DATA) public data: RequisitionModel, public dialog: MatDialog) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      code: [''],
      type: [''],
      signerId: [''],
      organization: [''],
      status: [''],
      reason: [''],
      createDate: [''],
      createUser: [''],
      transferComment: [''],
      transferDate: [''],
      transferUser: [''],
      deadline: [''],
    });

    this.urlDownload = AppSettings.BASE_URL + '/files/download/' + this.data.fileId;

    const requisition = await this.apiService.get('/requisitions/' + this.data.id, null).toPromise() as RequisitionModel;
    this.title = requisition.title;
    this.fileName = requisition.file.fileName;

    this.addEditForm.setValue(Utils.reduceEntityAttributeForFormControl(this.addEditForm, requisition));
    this.addEditForm.get('createDate').setValue(this.datePipe.transform(requisition.createDate, AppSettings.DIS_DATE_FORMAT, '-0'));
    this.addEditForm.get('transferDate').setValue(this.datePipe.transform(requisition.transferDate, AppSettings.DIS_DATE_FORMAT, '-0'));
    this.addEditForm.get('organization').setValue(requisition.organization.name);
    this.addEditForm.get('deadline').setValue(this.datePipe.transform(requisition.deadline, AppSettings.DIS_DATE_FORMAT, '+7'));
    this.receivers = requisition.receivers;
    console.log(this.receivers);
    this.selectModelInit(requisition);
  };

  download(){
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/pdf; charset=utf-8');
     this.http.get(this.urlDownload, {
      headers,
      responseType: 'blob',
    }).subscribe(data => {
       let downloadURL = window.URL.createObjectURL(data);
       let link = document.createElement('a');
       link.href = downloadURL;
       link.download = this.data.title + "_" + this.datePipe.transform(new Date(), AppSettings.DOWNLOAD_DATE_FORMAT, '-0') + ".pdf" ;
       link.click();
     });
  }

  async selectModelInit(requisition: RequisitionModel) {

    Object.keys(RequisitionTypeEnum).forEach(key => {
      if (key.replace('_', '') === requisition.type) {
        const type = Utils.getEnumValue(RequisitionTypeEnum, key.replace('_', ''));
        this.translateService.get(type).subscribe(res => {
          this.addEditForm.get('type').setValue(res);
        });
      }
    });

    Object.keys(RequisitionStatusEnum).forEach(key => {
      if (key.replace('_', '') === requisition.status.toString()) {
        const status = Utils.getEnumValue(RequisitionStatusEnum, key.replace('_', ''));
        this.translateService.get(status).subscribe(res => {
          this.addEditForm.get('status').setValue(res);
        });
      }
    });

    this.addEditForm.get('signerId').setValue(requisition.signer.lastName + ' ' + requisition.signer.firstName);

  }

  process() {
    this.serviceUtils.execute(this.apiService.put('/requisitions/' + this.data.id + '/process', this.data),
      this.onSuccessFunc, 'requisition.success.process',
       'requisition.confirm.process');
  }

  cancelProcess() {
    this.serviceUtils.execute(this.apiService.put('/requisitions/' + this.data.id + '/cancel', this.data),
      this.onSuccessFunc, 'requisition.success.cancelProcess',
      'requisition.confirm.cancelProcess');
  }

  transfer():void {
    const dialogRef = this.dialog.open(TransferRequisitionComponent, {
      width: '60%',
      maxWidth: '60%',
      height: '80%',
      maxHeight: '80%',
      data: this.data,
    });
    this.onCloseDialog();
  }

  approve() {
    this.data.isReject = false;
    this.openDialog(this.data).subscribe( data => {
      if (data != null) {
        this.onCloseDialog();
      }
    });
  }

  reject() {
    this.data.isReject = true;
    this.openDialog(this.data).subscribe( data => {
      if (data != null) {
        this.onCloseDialog();
      }
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

  isCancelProcessPermission(): boolean{
    return (this.data.status == 1 && this.data.createUser === this.cookieService.get('username'));
  }

  isApproveOrRejectPermission(): boolean {
    return (this.data.status == 1 && this.data.signerId === this.cookieService.get('username'));
  }

  hasAuthority(): boolean {
    return (AuthoritiesUtils.hasAuthority('put/requisitions/{id}/process')
      || AuthoritiesUtils.hasAuthority('put/requisitions/{id}/cancel')
      || AuthoritiesUtils.hasAuthority('put/requisitions/{id}/transfer')
    );
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    this.onCloseDialog();
  };

}
