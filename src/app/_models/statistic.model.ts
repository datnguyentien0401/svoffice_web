import {FormGroup} from '@angular/forms';

export class StatisticModel {
  createDoc: number;
  signDoc: number;
  recvDoc: number;
  sendDoc: number;


  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      if (form.get('createDoc')) {
        this.createDoc = form.get('createDoc').value;
      }
      if (form.get('recvDoc')) {
        this.recvDoc = form.get('recvDoc').value;
      }
      if (form.get('signDoc')) {
        this.signDoc = form.get('signDoc').value;
      }
      if (form.get('sendDoc')) {
        this.sendDoc = form.get('sendDoc').value;
      }
    }
  }
}
