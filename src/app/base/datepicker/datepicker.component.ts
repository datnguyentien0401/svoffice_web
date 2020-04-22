import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    DatePipe
  ]
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() placeholder: string;
  @Input() $value = '';

  get datepickerValue() {
    return this.$value;
  }

  set datepickerValue(val) {
    this.$value = val;
    console.log(this.$value);
    this.propagateChange(this.$value);
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.$value = obj;
    this.propagateChange(this.$value);
  }
}
