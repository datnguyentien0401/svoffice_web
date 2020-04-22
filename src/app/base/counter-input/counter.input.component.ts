import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-counter-input',
  templateUrl: './counter.input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterInputComponent),
      multi: true
    }
  ]
})
export class CounterInputComponent implements ControlValueAccessor {

  @Input()
  value = 0;

  get counterValue() {
    return this.value;
  }

  set counterValue(val) {
    this.value = val;
    this.propagateChange(this.value);
  }

  increment() {
    this.value++;
    this.propagateChange(this.value);
  }

  decrement() {
    this.value--;
    this.propagateChange(this.value);
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }
}
