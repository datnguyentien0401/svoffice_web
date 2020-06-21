import {Component, Inject} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {BaseAddEditLayout} from '../../base/layouts/BaseAddEditLayout';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../_services/api.service';
import {ServiceUtils} from '../../base/utils/service.utils';
import {ConfirmRequisitionComponent} from "../sign_document/confirm-requesition/confirm-requisition.component";

@Component({
  selector: 'app-add-edit-environment',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent extends BaseAddEditLayout {
  moduleName = 'otp.';
  response: any;
  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<ConfirmRequisitionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      otp: [''],
    });

  }

  onSubmit(): void {
    this.response = this.addEditForm.get('otp').value;
    this.onCloseDialog();
  }

  onCloseDialog() {
    this.dialogRef.close(
      {data: this.response}
    );
  }

}
