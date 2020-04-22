import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {SelectModel} from '../../_models/base/select.model';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() data: SelectModel[];
  @Input() disabled = false;
  @Input() required = false;
  @Input() readonly = false;
  @Output() onSelectedChange = new EventEmitter();

  @Input() $value: SelectModel;

  get selectedValue() {
    return this.$value;
  }

  set selectedValue(val) {
    this.$value = val;
    this.propagateChange(this.$value);
  }

  onChange(value: SelectModel) {
    this.$value = value;
    this.propagateChange(this.$value);
    this.onSelectedChange.emit();
  }

  propagateChange = (_: any) => {
  };

  writeValue(obj: any): void {
    this.$value = obj;
    this.propagateChange(this.$value);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }
}
