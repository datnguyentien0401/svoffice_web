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
import {SelectModel} from "../../../_models/base/select.model";
import {RequisitionTypeEnum} from "../../../_models/enums/RequisitionTypeEnum";
import {RequisitionModel} from "../../../_models/requisition.model";
import {User} from "../../../_models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FileModel} from "../../../_models/file.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {RequisitionComponent} from "../requisition.component";

@Component({
  selector: 'app-a-e-organization',
  templateUrl: './a-e-requisition.component.html',
  styleUrls: ['./a-e-requisition.component.scss']
})
export class AddEditRequisitionComponent extends BaseAddEditLayout {
  moduleName = 'requisition.ae.';

  typeValues: SelectModel[] = [];
  signerValues: SelectModel[] = [];
  receiverValues: SelectModel[] = [];
  file: File;
  fileId: number;

  constructor(protected activatedRoute: ActivatedRoute, protected formBuilder: FormBuilder, protected location: Location, private http: HttpClient,
              protected translateService: TranslateService, protected apiService: ApiService, protected serviceUtils: ServiceUtils,
              @Inject(MAT_DIALOG_DATA) public data: RequisitionModel, public dialogRef: MatDialogRef<RequisitionComponent>,) {
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
      title: [''],
      type: [''],
      signerIds: [''],
      fileUpload: [''],
      receiverIds: ['']
    });

    this.selectModelInit();
    this.addEditForm.get('receiverIds').setValue([]);
    if (this.isEdit) {
      const requisition = await this.apiService.get('/requisitions/' + this.data.id, null).toPromise() as RequisitionModel;

      requisition.fileUpload = new File([""], requisition.file.filePath);
      this.fileId = requisition.fileId;

      requisition.signerIds = [];
      requisition.receiverIds = [];
      this.addEditForm.setValue(Utils.reduceEntityAttributeForFormControl(this.addEditForm, requisition));

      if (requisition.signerList) {
        console.log(requisition.signerList.split(',').filter(obj => {
          return obj != '';
        }));
        this.addEditForm.get('signerIds').setValue(requisition.signerList.split(',').filter(obj => {
          return obj != '';
        }));
      } else {
        this.addEditForm.get('signerIds').setValue([]);
      }
      if (requisition.receivers) {
        this.addEditForm.get('receiverIds').setValue(requisition.receivers.split(',').filter(obj => {
          return obj != '';
        }));
      } else {
        this.addEditForm.get('receiverIds').setValue([]);
      }

      this.file = new File([""], requisition.file.fileName);
    } else {
      this.addEditForm.get('signerIds').setValue([]);
      this.addEditForm.get('receiverIds').setValue([]);
    }
  };

  async selectModelInit() {
    Object.keys(RequisitionTypeEnum).forEach(key => {
      if (key === '_') {
        return;
      }
      const type = Utils.getEnumValue(RequisitionTypeEnum, key.replace('_', ''));

      this.translateService.get(type).subscribe(res => {
        this.typeValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });

    const recvUsers = await this.apiService.get('/users/all', null).toPromise() as User[];
    recvUsers.forEach((recvUser: User) => {
      this.receiverValues.push(new SelectModel(recvUser.username, recvUser.lastName + ' ' + recvUser.firstName));
    });

    const signers = await this.apiService.get('/users/leaders', null).toPromise() as User[];
    signers.forEach((leader: User) => {
      this.signerValues.push(new SelectModel(leader.username, leader.lastName + ' ' + leader.firstName));
    });
  }

  onChangeFileUpload(event: any): void {
    this.file = <File>event.target.files[0];
  }

  onSubmit(): void {
    console.log(this.addEditForm);
    const objSave = new RequisitionModel(this.addEditForm);
    let apiCall;
    let action;

    let formData: FormData = new FormData();
    formData.append("file", this.file, this.file.name);
    formData.append("isSignature", `${false}`);

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      reportProgress: true
    };
    if (this.file.size == 0) {
      objSave.fileId = this.fileId;
      objSave.id = this.id;
      apiCall = this.apiService.put('/requisitions', objSave);
      action = 'edit';
      this.serviceUtils.execute(apiCall, this.onSuccessFunc, this.moduleName + action + '.success', this.moduleName + action + '.confirm');

    } else {
      this.http.post<FileModel>(this.apiService.getFullUrl('/files'), formData, httpOptions).subscribe(
        data => {
          objSave.fileId = data.id;
          if (this.isEdit) {
            objSave.id = this.id;
            apiCall = this.apiService.put('/requisitions', objSave);
            action = 'edit';
          } else {
            apiCall = this.apiService.post('/requisitions', objSave);
            action = 'add';
          }

          this.serviceUtils.execute(apiCall, this.onSuccessFunc, this.moduleName + action + '.success', this.moduleName + action + '.confirm');

        }
      );
    }
  }

  hasAuthority(): boolean {
    return (this.isEdit && AuthoritiesUtils.hasAuthority('put/requisitions'))
      || (!this.isEdit && AuthoritiesUtils.hasAuthority('post/requisitions'));
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
    }, 1500);
  };
}
