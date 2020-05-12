import {Component, Inject} from '@angular/core';

import {FormBuilder} from '@angular/forms';
import {DatePipe, Location} from '@angular/common';
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
import {AppSettings} from "../../../app.settings";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  providers: [DatePipe]
})
export class UserDetailComponent extends BaseAddEditLayout {
  moduleName = 'user.ae.';

  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];
  signatureFileUrl;
  private fileName: string;

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location,  private datePipe: DatePipe,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              public dialogRef: MatDialogRef<SignDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: User, private http: HttpClient) {
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

    const user = await this.apiService.get('/users/' + this.data.username, null).toPromise() as User;

    this.addEditForm.setValue(Utils.reduceEntityAttributeForFormControl(this.addEditForm, user));
    this.addEditForm.get('organization').setValue(user.organization.name);

    this.selectModelInit(user);

    this.signatureFileUrl = AppSettings.BASE_URL + '/files/download/' + user.signatureFileId;
    this.fileName = user.signatureFile.fileName;
  };

  async selectModelInit (user: User) {
    Object.keys(UserTypeEnum).forEach(key => {
      if (key.replace('_', '') === user.type) {
        const type = Utils.getEnumValue(UserTypeEnum, key.replace('_', ''));
        this.translateService.get(type).subscribe(res => {
          this.addEditForm.get('type').setValue(res);
        });
      }
    });
    Object.keys(UserStatusEnum).forEach(key => {
      let statusInt = user.status ? 1: 0;
      if (key.replace('_', '') === statusInt.toString() ) {
        const status = Utils.getEnumValue(UserStatusEnum, key.replace('_', ''));
        this.translateService.get(status).subscribe(res => {
          this.addEditForm.get('status').setValue(res);
        });
      }
    });
  }

  download() {
    console.log(this.signatureFileUrl);
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/pdf; charset=utf-8');
    this.http.get(this.signatureFileUrl, {
      headers,
      responseType: 'blob',
    }).subscribe(data => {
      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = this.data.signatureFile.fileName.replace(".", "_" + this.datePipe.transform(new Date(), AppSettings.DOWNLOAD_DATE_FORMAT, '-0') + ".");
      link.click();
    });

  }

  onTypeChange() {
    this.addEditForm.get('organization').setValue('');
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
