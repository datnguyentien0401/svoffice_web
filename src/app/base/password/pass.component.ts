import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './pass.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PassComponent),
      multi: true
    }
  ]
})
export class PassComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() placeholder: string;
  @Input() hint: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() $text = '';
  @Input() readonly  = false;

  get textValue() {
    return this.$text;
  }

  set textValue(val) {
    this.$text = val;
    this.propagateChange(this.$text);
  }

  propagateChange = (_: any) => {
  };

  writeValue(obj: any): void {
    this.$text = obj;
    this.propagateChange(this.$text);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }
}
