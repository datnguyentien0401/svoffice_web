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
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent extends BaseAddEditLayout {
  moduleName = 'password';
  password: any;
  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<ConfirmRequisitionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      pass: [''],
      newPass: [''],
      newPassConfirm: [''],
    });

  }

  onSubmit(): void {
    this.password.pass = this.addEditForm.get('pass').value;
    this.password.newPass = this.addEditForm.get('newPass').value;
    this.password.newPassConfirm = this.addEditForm.get('newPassConfirm').value;

    this.serviceUtils.execute(this.apiService.post('/users/change-pass', this.password),
      this.onSuccessFunc, this.moduleName + '.success.change',
      this.moduleName + '.confirm.change');
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    this.onCloseDialog();
  };

  onCloseDialog() {
    this.dialogRef.close();
  }

}
