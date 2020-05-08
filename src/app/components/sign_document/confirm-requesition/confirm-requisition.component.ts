import {Component, Inject, Input, OnInit} from '@angular/core';

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

@Component({
  selector: 'app-confirm-active-warehouse',
  templateUrl: './confirm-requisition.component.html',
  styleUrls: ['./confirm-requisition.component.scss']
})
export class ConfirmRequisitionComponent extends BaseAddEditLayout {

  moduleName = 'requisition.confirm';

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<SignDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: RequisitionModel) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      reason: [''],
    });
  };

  onSubmit(): void {
    this.data.reason = this.addEditForm.get('reason').value;

    this.serviceUtils.execute(this.apiService.put('/requisitions/' + this.data.id + (this.data.isReject ? '/reject' : '/approve'), this.data),
      this.onSuccessFunc, 'requisition.success' + (this.data.isReject ? '.reject' : '.approve') , null);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  hasAuthority(): boolean {
    if (AuthoritiesUtils.hasAuthority('put/requisitions/{id}/approve') ||
      AuthoritiesUtils.hasAuthority('put/requisitions/{id}/reject')) {
      return true;
    }
    return false;
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    this.onCloseDialog();
  };

}
