import {FormGroup} from '@angular/forms';
import {User} from "./user.model";
import {FileModel} from "./file.model";
import {OrganizationModel} from "./organization.model";

export class RequisitionModel {
  id: number;
  code: string;
  title: string;
  createDate: string;
  type: string;
  status: number;
  signer: User;
  signerId: string;
  fileId: number;
  file: FileModel;
  fileUpload: File;
  reason: string;
  isReject: boolean;
  organization: OrganizationModel;
  organizationId: number;

  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      console.log(form);
      if (form.get('id')) {
        this.id = form.get('id').value;
      }
      if (form.get('code')) {
        this.code = form.get('code').value;
      }
      if (form.get('title')) {
        this.title = form.get('title').value;
      }
      if (form.get('status')) {
        this.status = form.get('status').value;
      }
      if (form.get('type')) {
        this.type = form.get('type').value;
      }
      if (form.get('createDate')) {
        this.createDate = form.get('createDate').value;
      }
      if (form.get('signerId')) {
        this.signerId = form.get('signerId').value;
      }
      if (form.get('fileId')) {
        this.fileId = form.get('fileId').value;
      }
      if (form.get('file')) {
        this.file = form.get('file').value;
      }
      if (form.get('fileUpload')) {
        this.fileUpload = form.get('fileUpload').value;
      }
      if (form.get('signer')) {
        this.signer = new User(form.get('signer').value);
      }
      if (form.get('reason')) {
        this.signer = new User(form.get('reason').value);
      }
      if (form.get('organization')) {
        this.organization = new OrganizationModel(form.get('organization').value);
      }
      if (form.get('organizationId')) {
        this.organizationId = form.get('organizationId').value;
      }

    } else {
      this.id = form;
    }
  }
}
