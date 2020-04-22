import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import {BaseAddEditLayout} from "../../../base/layouts/BaseAddEditLayout";
import {SelectModel} from "../../../_models/base/select.model";
import {AutocompleteModel} from "../../../_models/base/autocomplete.model";
import {ApiService} from "../../../_services/api.service";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {UserStatusEnum} from "../../../_models/enums/UserStatusEnum";
import {Utils} from "../../../base/utils/utils";
import {UserTypeEnum} from "../../../_models/enums/UserTypeEnum";
import {OrganizationModel} from "../../../_models/organization.model";
import {User} from "../../../_models/user.model";
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileModel} from "../../../_models/file.model";
import {RequisitionModel} from "../../../_models/requisition.model";

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add.edit.user.component.html',
  styleUrls: ['./add.edit.user.component.scss']
})
export class AddEditUserComponent extends BaseAddEditLayout {
  moduleName = 'user.ae.';

  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];
  organizationValues: AutocompleteModel[] = [];

  signatureFileUpload: File;
  signatureFileId: number;

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location, private http: HttpClient,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils) {
    super(activatedRoute, location, translateService, serviceUtils);
  }

  ngOnInit = async () => {
    super.ngOnInit();

    this.addEditForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      lastName: [''],
      tel: [''],
      email: [''],
      status: [''],
      type: [''],
      organization: [''],
      signatureFileUpload: ['']
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
      tempOrg.push(new AutocompleteModel(organization.id, organization.code + ' - ' + organization.name));
    });
    this.organizationValues = tempOrg;
    if (this.isEdit) {
      const user = await this.apiService.get('/users/' + this.id, null).toPromise() as User;
      user.signatureFileUpload = new File([""], user.signatureFile.filePath);
      this.signatureFileId = user.signatureFileId;

      this.addEditForm.setValue(Utils.reduceEntityAttributeForFormControl(this.addEditForm, user));
      this.signatureFileUpload = new File([""], user.signatureFile.filePath);
      console.log(this.signatureFileUpload);
    } else {
      this.addEditForm.get('status').setValue('0');
    }

  }

  onChangeFileUpload(event: any): void {
    console.log(event);
    let fileInput = <File>event.target.files[0];
    this.signatureFileUpload = fileInput;
  }

  onSubmit(): void {
    let objSave = new User(this.addEditForm);
    console.log(objSave);
    let apiCall;
    let action;

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      reportProgress: true
    }

    let formData: FormData = new FormData();
    formData.append("file", this.signatureFileUpload, this.signatureFileUpload.name);
    formData.append("isSignature", `${true}`);
    if (this.signatureFileUpload.size != 0) {
      this.http.post<FileModel>(this.apiService.getFullUrl('/files'), formData, httpOptions).subscribe(
        data => {
          objSave.signatureFileId = data.id;
          if (this.isEdit) {
            objSave.id = this.id;
            apiCall = this.apiService.patch('/users', objSave);
            action = 'edit';
          } else {
            apiCall = this.apiService.post('/users', objSave);
            action = 'add';
          }

          this.serviceUtils.execute(apiCall, this.onSuccessFunc, this.moduleName + action + '.success', this.moduleName + action + '.confirm');
        }
      );
    } else {
      objSave.signatureFileId = this.signatureFileId;
      objSave.id = this.id;
      apiCall = this.apiService.patch('/users', objSave);
      action = 'edit';
      this.serviceUtils.execute(apiCall, this.onSuccessFunc, this.moduleName + action + '.success', this.moduleName + action + '.confirm');
    }


  }

  hasAuthority(): boolean {
    if ((this.isEdit && AuthoritiesUtils.hasAuthority('patch/users'))
      || (!this.isEdit && AuthoritiesUtils.hasAuthority('post/users'))) {
      return true;
    }
    return false;
  }

  isExists(): boolean {
    return this.addEditForm.get('status').value != null;
  }

  onTypeChange() {
    this.addEditForm.get('organization').setValue('');
  }
}
