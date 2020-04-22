import {FormGroup} from '@angular/forms';

export class OrganizationModel {
  id: number;
  code: string;
  name: string;
  status: boolean;

  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      if (form.get('id')) {
        this.id = form.get('id').value;
      }
      if (form.get('code')) {
        this.code = form.get('code').value;
      }
      if (form.get('name')) {
        this.name = form.get('name').value;
      }
      if (form.get('status')) {
        this.status = form.get('status').value === 1 ? true : false;
      }
    } else {
      this.id = form;
    }
  }
}
