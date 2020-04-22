import {Menu} from './menu';
import {FormGroup} from '@angular/forms';

export class RoleModel {
  id: number;
  clientId: string;
  roleName: string;
  menus: Menu[];

  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      this.id = form.get('id').value;
      this.clientId = form.get('clientId').value;
      this.roleName = form.get('roleName').value;
    } else {
      this.id = form;
    }
  }
}
