import {Component, Inject} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
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
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {SignDocumentComponent} from "../../sign_document/sign_document.component";
import {OrganizationModel} from "../../../_models/organization.model";
import {TransferModel} from "../../../_models/transfer.model";

@Component({
  selector: 'app-a-e-organization',
  templateUrl: './transfer-requisition.component.html',
  styleUrls: ['./transfer-requisition.component.scss'],
})
export class TransferRequisitionComponent extends BaseAddEditLayout {
  moduleName = 'requisition.transfer.';

  recvUserValues: SelectModel[] = [];
  organizationValues: SelectModel[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<SignDocumentComponent>,  protected router: Router,
              @Inject(MAT_DIALOG_DATA) public data: RequisitionModel) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      comment: [''],
      receiveOrgIds: [''],
      receiveUserIds: [''],
    });

    this.addEditForm.get('receiveOrgIds').setValue([]);
    this.addEditForm.get('receiveUserIds').setValue([]);

    this.selectModelInit();
  };

  async selectModelInit() {

    const organizations = await this.apiService.get('/organizations/all', null).toPromise() as OrganizationModel[];
    organizations.forEach((organization: OrganizationModel) => {
      this.organizationValues.push(new SelectModel(organization.id, organization.code + ' - ' + organization.name));
    });

    const recvUsers = await this.apiService.get('/users/all', null).toPromise() as User[];
    recvUsers.forEach((recvUser: User) => {
      this.recvUserValues.push(new SelectModel(recvUser.username, recvUser.lastName + ' ' + recvUser.firstName));
    });
  }

  onSubmit(): void {
    const transferDto = new TransferModel(this.addEditForm);
    console.log(transferDto);
    this.serviceUtils.execute(this.apiService.put('/requisitions/' + this.data.id + '/transfer', transferDto),
      this.onSuccessFunc,  'requisition.success.transfer',
       'requisition.confirm.transfer');
  }

  hasAuthority(): boolean {
    return (AuthoritiesUtils.hasAuthority('put/requisitions/{id}/transfer'));
  }

  onCloseDialog() {
    this.dialogRef.close();
    console.log(this.router.url);
    this.router.navigate([this.router.url]);
    this.location.forward();
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    this.onCloseDialog();
  };

  isNotTranferBtnPermission(): boolean {
    return (this.addEditForm.get('receiveOrgIds').value === '' && this.addEditForm.get('receiveUserIds').value === '');
  }

}
