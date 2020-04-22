import {FormGroup} from '@angular/forms';
import {OrganizationModel} from "./organization.model";
import {FileModel} from "./file.model";

export class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  tel: string;
  email: string;
  status: boolean;
  type: string;
  organizationId: number;
  organization: OrganizationModel;
  signatureFileId: number;
  signatureFile: FileModel;
  signatureFileUpload: File;

  constructor(form: FormGroup | string) {
    if (form instanceof FormGroup) {
      this.username = form.get('username').value;
      this.firstName = form.get('firstName').value;
      this.lastName = form.get('lastName').value;
      this.fullName = this.lastName + ' ' + this.firstName;
      this.tel = form.get('tel').value;
      this.email = form.get('email').value;
      this.status = form.get('status').value === 1;
      this.type = form.get('type').value;
      this.organizationId = form.get('organization').value;
      if (form.get('organization')) {
        this.organization = new OrganizationModel(form.get('organization').value);
      }
      if (form.get('signatureFileId')) {
        this.signatureFileId = form.get('signatureFileId').value;
      }
      if (form.get('signatureFile')) {
        this.signatureFile = form.get('signatureFile').value;
      }
      if (form.get('signatureFileUpload')) {
        this.signatureFileUpload = form.get('signatureFileUpload').value;
      }
    } else {
      this.username = form;
    }
  }
}
