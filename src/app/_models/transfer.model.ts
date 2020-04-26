import {FormGroup} from '@angular/forms';

export class TransferModel {
  comment: number;
  receiveUserIds: [];
  receiveOrgIds: [];

  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      if (form.get('comment')) {
        this.comment = form.get('comment').value;
      }
      if (form.get('receiveUserIds')) {
        this.receiveUserIds = form.get('receiveUserIds').value;
      }
      if (form.get('receiveOrgIds')) {
        this.receiveOrgIds = form.get('receiveOrgIds').value;
      }
    }
  }
}
