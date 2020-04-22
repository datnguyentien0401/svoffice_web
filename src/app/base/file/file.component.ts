import {Component, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileComponent),
      multi: true
    }
  ]
})
export class FileComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() placeholder: string;
  @Input() hint: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() file: File;
  @Output() onSelectedChange = new EventEmitter();

  get fileValue() {
    return this.file;
  }

  set fileValue(fileInput: any) {
    console.log(fileInput);
    this.file = <File>fileInput.target.files[0];
  }

  onChange(fileInput: any) {
    this.file = <File>fileInput.target.files[0];
    this.propagateChange(this.file);
    this.onSelectedChange.emit();
  }

  propagateChange = (_: any) => {
  };

  writeValue(fileInput: any): void {
    this.file = <File>fileInput.target.files[0];
    this.propagateChange(this.file);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }
}
