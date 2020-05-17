import {FormGroup} from '@angular/forms';

export class NotificationModel {
  id: number;
  content: string;
  createDate: string;
  deadline: string;
  sender: string;
  receiver: string;

  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      if (form.get('id')) {
        this.id = form.get('id').value;
      }
      if (form.get('content')) {
        this.content = form.get('content').value;
      }
      if (form.get('createDate')) {
        this.createDate = form.get('createDate').value;
      }
      if (form.get('deadline')) {
        this.deadline = form.get('deadline').value;
      }
      if (form.get('sender')) {
        this.sender = form.get('sender').value;
      }
      if (form.get('receiver')) {
        this.receiver = form.get('receiver').value;
      }
    } else {
      this.id = form;
    }
  }
}
