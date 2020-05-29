import {Component, Inject} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from "../../../_services/api.service";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {BaseAddEditLayout} from "../../../base/layouts/BaseAddEditLayout";
import {Utils} from "../../../base/utils/utils";
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {OrganizationModel} from "../../../_models/organization.model";
import {OrganizationStatusEnum} from "../../../_models/enums/OrganizationStatusEnum";
import {SelectModel} from "../../../_models/base/select.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {RequisitionModel} from "../../../_models/requisition.model";
import {OrganizationComponent} from "../list-organization/organization.component";

@Component({
  selector: 'app-a-e-organization',
  templateUrl: './a-e-organization.component.html',
  styleUrls: ['./a-e-organization.component.scss']
})
export class AddEditOrganizationComponent extends BaseAddEditLayout {
  moduleName = 'organization.ae.';
  statusValues: SelectModel[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              @Inject(MAT_DIALOG_DATA) public data: RequisitionModel, public dialogRef: MatDialogRef<OrganizationComponent>,) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();
    if (this.data) {
      this.isEdit = true;
      this.id = this.data.id;
    }
    this.addEditForm = this.formBuilder.group({
      code: [''],
      name: [''],
      status: [''],
    });

    Object.keys(OrganizationStatusEnum).forEach(key => {
      const status = Utils.getEnumValue(OrganizationStatusEnum, key.replace('_', ''));
      this.translateService.get(status).subscribe(res => {
        this.statusValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });

    if (this.isEdit) {
      const organization = await this.apiService.get('/organizations/' + this.id, null).toPromise() as OrganizationModel;
      this.addEditForm.setValue(Utils.reduceEntityAttributeForFormControl(this.addEditForm, organization));
    } else {
      this.addEditForm.get('status').setValue('1');
    }
  };

  onSubmit(): void {
    const objSave = new OrganizationModel(this.addEditForm);
    let apiCall;
    if (this.isEdit) {
      objSave.id = this.id;
      apiCall = this.apiService.patch('/organizations/' + this.id, objSave);
    } else {
      const body: OrganizationModel[] = [];
      body.push(objSave);
      apiCall = this.apiService.post('/organizations', body);
    }
    const action = this.isEdit ? 'edit' : 'add';
    this.serviceUtils.execute(apiCall, this.onSuccessFunc, this.moduleName + action + '.success', this.moduleName + action + '.confirm');
  }

  hasAuthority(): boolean {
    return (this.isEdit && AuthoritiesUtils.hasAuthority('patch/organizations/{id}'))
      || (!this.isEdit && AuthoritiesUtils.hasAuthority('post/organizations'));

  }

  isExists(): boolean {
    return this.addEditForm.get('status').value != null;
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    setTimeout(() => {
      this.onCloseDialog();
    }, 1000);
  };
}
