import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MAT_CHECKBOX_CLICK_ACTION} from '@angular/material';
import {CheckboxModel} from '../../_models/base/checkbox.model';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    },
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() listData: CheckboxModel[];

  propagateChange = (_: any) => {
  };

  writeValue(obj: any): void {
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }
}
