import {FormGroup} from '@angular/forms';

export class FileModel {
  id: number;
  fileName: string;
  filePath: string;

  constructor(form: FormGroup | number) {
    if (form instanceof FormGroup) {
      if (form.get('id')) {
        this.id = form.get('id').value;
      }
      if (form.get('fileName')) {
        this.fileName = form.get('fileName').value;
      }
      if (form.get('filePath')) {
        this.filePath = form.get('filePath').value;
      }
    } else {
      this.id = form;
    }
  }
}
