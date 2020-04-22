import {Component, Inject} from '@angular/core';

import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {BaseAddEditLayout} from "../../../base/layouts/BaseAddEditLayout";
import {SelectModel} from "../../../_models/base/select.model";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../_services/api.service";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {User} from "../../../_models/user.model";
import {UserStatusEnum} from "../../../_models/enums/UserStatusEnum";
import {Utils} from "../../../base/utils/utils";
import {UserTypeEnum} from "../../../_models/enums/UserTypeEnum";
import {OrganizationModel} from "../../../_models/organization.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {SignDocumentComponent} from "../../sign_document/sign_document.component";

@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends BaseAddEditLayout {
  moduleName = 'user.ae.';

  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];
  organizationValues: SelectModel[] = [];
  signatureFilePath: string;

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<SignDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: User) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      tel: [''],
      email: [''],
      status: [''],
      type: [''],
      organization: [''],
    });

    Object.keys(UserStatusEnum).forEach(key => {
      if (key === '_') {
        return;
      }
      const value = Utils.getEnumValue(UserStatusEnum, key.replace('_', ''));
      this.translateService.get(value).subscribe(res => {
        this.statusValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });
    Object.keys(UserTypeEnum).forEach(key => {
      if (key === '_') {
        return;
      }
      const value = Utils.getEnumValue(UserTypeEnum, key.replace('_', ''));
      this.translateService.get(value).subscribe(res => {
        this.typeValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });
    const organizations = await this.apiService.get('/organizations/all', null).toPromise() as OrganizationModel[];
    const tempOrg = [];
    organizations.forEach((organization: OrganizationModel) => {
      tempOrg.push(new SelectModel(organization.id, organization.code + ' - ' + organization.name));
    });
    this.organizationValues = tempOrg;

    const user = await this.apiService.get('/users/' + this.data.username, null).toPromise() as User;
    this.signatureFilePath = user.signatureFile.filePath;
    this.addEditForm.setValue(Utils.reduceEntityAttributeForFormControl(this.addEditForm, user));

  };

  onTypeChange() {
    this.addEditForm.get('organization').setValue('');
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
