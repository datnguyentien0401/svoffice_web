import {Component, Inject} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {RequisitionModel} from "../../../_models/requisition.model";
import {SignDocumentComponent} from "../sign_document.component";
import {BaseAddEditLayout} from "../../../base/layouts/BaseAddEditLayout";
import {ApiService} from "../../../_services/api.service";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileModel} from "../../../_models/file.model";

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
              public dialogRef: MatDialogRef<SignDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: RequisitionModel) {
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

      this.serviceUtils.showLoading();
      this.http.post<FileModel>(
        this.apiService.getFullUrl('/requisitions/approve'), formData, httpOptions).subscribe(
        res => {
          this.onSuccessFunc(res, 'requisition.success.approve');
          this.serviceUtils.hideLoading();
        });
      // const apiCall = this.http.post<FileModel>(this.apiService.getFullUrl('/requisitions/approve'), FormData);
      // this.serviceUtils.execute(
      //   apiCall,
      //   this.onSuccessFunc, 'requisition.success.approve',
      //   'requisition.confirm.approve');
    }

  }

  onChangeFileUpload(event: any): void {
    this.file = <File>event.target.files[0];
  }

  onCloseDialog(data: any|null) {
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
