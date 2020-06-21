import {FormGroup} from '@angular/forms';

export class PasswordModel {
 password: string;
 newPassword: string;
 newPasswordConfirm: string;


  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      if (form.get('password')) {
        this.password = form.get('password').value;
      }
      if (form.get('newPassword')) {
        this.newPassword = form.get('newPassword').value;
      }
      if (form.get('newPasswordConfirm')) {
        this.newPasswordConfirm = form.get('newPasswordConfirm').value;
      }
    }
  }
}
