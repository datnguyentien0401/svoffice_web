import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AutocompleteModel} from '../../_models/base/autocomplete.model';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor {
  $data: AutocompleteModel[];
  @Input() set data(value: AutocompleteModel[]){
    this.$data = value;
  }
  @Input() placeholder: string;
  @Input() label: string;
  @Input() hint: string;
  @Input() required: boolean;
  @Input() readonly: boolean;
  @Output() onSelectedChange = new EventEmitter();

  filteredOptions: AutocompleteModel[];
  $selectedValue: AutocompleteModel;

  get selectedValue() {
    return this.$selectedValue;
  }

  set selectedValue(val) {
    this.setSelectedValue(val);
  }

  propagateChange = (_: any) => {
  };

  writeValue(obj: any): void {
    this.setSelectedValue(obj);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

  setSelectedValue(val) {
    this.$selectedValue = val;
    this.propagateChange(this.$selectedValue);
    this.onSelectedChange.emit();
  }

  clearFilterValue() {
    this.filteredOptions = this.$data;
  }

  doFilter(value: AutocompleteModel | string | number) {
    this.filteredOptions = value ? this._filter(value) : this.$data;
  }

  private _filter(value: AutocompleteModel | string | number): AutocompleteModel[] {
    let filterValue;
    if (value instanceof AutocompleteModel) {
      filterValue = value.displayValue.toLowerCase();
    } else {
      filterValue = value.toString().toLowerCase();
    }
    return filterValue && filterValue.length > 0
      ? this.$data.filter(result => result.displayValue.toLowerCase().includes(filterValue))
      : this.$data;
  }

  displayFn(value?: number | string): string {
    if (!value) {
      return undefined;
    }
    const matAuto = this.filteredOptions
      ? this.filteredOptions.find(result => result.value === value)
      : (this.$data ? this.$data.find(result => result.value === value) : null);
    return !matAuto ? undefined : matAuto.displayValue;
  }
}
