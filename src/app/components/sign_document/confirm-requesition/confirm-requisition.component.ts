import {Component, Inject} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {RequisitionModel} from "../../../_models/requisition.model";
import {SignDocumentComponent} from "../sign_document.component";
import {BaseAddEditLayout} from "../../../base/layouts/BaseAddEditLayout";
import {ApiService} from "../../../_services/api.service";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {OtpComponent} from "../../otp/otp.component";
import {ApproveModel} from "../../../_models/approve.model";

@Component({
  selector: 'app-confirm-active-warehouse',
  templateUrl: './confirm-requisition.component.html',
  styleUrls: ['./confirm-requisition.component.scss']
})
export class ConfirmRequisitionComponent extends BaseAddEditLayout {

  moduleName = 'requisition.confirm';
  file: File;

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location, private http: HttpClient,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<SignDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: RequisitionModel, public dialog: MatDialog) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      reason: [''],
      file: [''],
      absoluteX: [''],
      absoluteY: [''],
    });
  };

  onSubmit(): void {
    if (this.data.isReject) {
      this.data.reason = this.addEditForm.get('reason').value;
      this.serviceUtils.execute(this.apiService.put('/requisitions/' + this.data.id + '/reject', this.data),
        this.onSuccessFunc, 'requisition.success.reject', null);
    } else {
      const body = new ApproveModel(this.data.signer.tel);
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
        }),
        reportProgress: true
      };

      let formData: FormData = new FormData();
      formData.append("file", this.file, this.file.name);
      formData.append("id", `${this.data.id}`);
      formData.append("absoluteX", `${this.addEditForm.get('absoluteX').value}`);
      formData.append("absoluteY", `${this.addEditForm.get('absoluteY').value}`);
      formData.append("clientRequestId", body.clientRequestId);
      formData.append("msisdn", body.msisdn);
      formData.append("key", "");


      this.serviceUtils.showLoading();
      this.http.post<ApproveModel>(
        this.apiService.getFullUrl('/requisitions/approve'), formData, httpOptions).subscribe(
        res => {
          this.serviceUtils.hideLoading();

          formData.set("key", res.key);

          this.showOtpModal(formData).subscribe(resOtpModal => {
            this.serviceUtils.showLoading();

            formData.append("otp", resOtpModal.data);
            this.http.post<ApproveModel>(
              this.apiService.getFullUrl('/requisitions/approve'),
              formData,
              httpOptions
            ).subscribe(res2 => {
              this.serviceUtils.hideLoading();
              this.onSuccessFunc(res2, 'requisition.success.approve');
            },e2 => {
              this.serviceUtils.hideLoading();
              this.serviceUtils.showError(e2);
            });
          });

        }, e => {
          this.serviceUtils.hideLoading();
          this.serviceUtils.showError(e);
        });
    }

  }

  showOtpModal(data): Observable<any> {
    const dialogRef = this.dialog.open(OtpComponent, {
      width: '50%',
      maxWidth: '50%',
      height: '60%',
      maxHeight: '60%',
      disableClose: true,
      data: data
    });
    return dialogRef.afterClosed();
  }

  onChangeFileUpload(event: any): void {
    this.file = <File>event.target.files[0];
  }

  onCloseDialog(data: any | null) {
    this.dialogRef.close(data);
  }

  hasAuthority(): boolean {
    return AuthoritiesUtils.hasAuthority('post/requisitions/approve') ||
      AuthoritiesUtils.hasAuthority('put/requisitions/{id}/reject');
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    this.onCloseDialog(data);
  };

}
