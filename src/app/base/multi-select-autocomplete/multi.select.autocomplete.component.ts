import {Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {SelectModel} from "../../_models/base/select.model";

@Component({
  selector: 'app-multi-select-autocomplete',
  templateUrl: './multi.select.autocomplete.component.html',
  styleUrls: ['./multi.select.autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectAutocompleteComponent),
      multi: true
    }
  ]
})
export class MultiSelectAutocompleteComponent implements ControlValueAccessor, OnChanges {

  @Input() placeholder: string;
  @Input() options: SelectModel[];
  @Input() disabled = false;
  @Input() errorMsg = 'Field is required';
  @Input() showErrorMsg = false;
  @Input() selectedOptions;
  @Input() multiple = true;
  @Input() label: string;

  @Output() selectionChange = new EventEmitter();

  @ViewChild('selectElem', {static: false}) selectElem;

  formControl = new FormControl();
  filteredOptions: SelectModel[] = [];
  selectedValue: Array<any> = [];
  selectAllChecked = false;
  displayString = '';
  labelCount: number = 1;
  appearance = 'standard';

  constructor(private translateService: TranslateService) {
  }

  propagateChange = (_: any) => {
  };

  writeValue(obj: any): void {
    this.selectedValue = obj;
    this.propagateChange(this.selectedValue);
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

  ngOnChanges() {
    this.filteredOptions = this.options;
    if (this.selectedOptions) {
      this.writeValue(this.selectedOptions);
    } else if (this.formControl.value) {
      this.writeValue(this.formControl.value);
    }
  }

  // toggleDropdown() {
  //   this.selectElem.toggle();
  // }

  toggleSelectAll = function (val) {
    if (val.checked) {
      this.filteredOptions.forEach((option: SelectModel) => {
        if (!this.selectedValue.includes(option.value) && !option.disabled) {
          this.writeValue(this.selectedValue ? this.selectedValue.concat([option.value]) : [option.value]);
        }
      });
    } else {
      const filteredValues = [];
      this.filteredOptions.forEach((option: SelectModel) => {
        if (!option.disabled) {
          filteredValues.push(option.value);
        }
      });
      const filteredSelectedValue = this.selectedValue.filter(
        item => !filteredValues.includes(item)
      );
      this.writeValue(filteredSelectedValue);
    }
    this.selectionChange.emit(this.selectedValue);
  };

  filterItem(value) {
    this.filteredOptions = this.options.filter(
      (item: SelectModel) => item.viewValue.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.selectAllChecked = true;
    this.filteredOptions.forEach((item: SelectModel) => {
      if (this.selectedValue instanceof Array && !this.selectedValue.includes(item.value)) {
        this.selectAllChecked = false;
      }
    });
  }

  hideOption(option) {
    return !(this.filteredOptions.indexOf(option) > -1);
  }

  // Returns plain strings array of filtered values
  getFilteredOptionsValues() {
    const filteredValues = [];
    this.filteredOptions.forEach((option: SelectModel) => {
      filteredValues.push(option.value);
    });
    return filteredValues;
  }

  onDisplayString() {
    this.displayString = '';
    if (this.selectedValue) {
      let displayOption: SelectModel[] = [];
      if (this.multiple) {
        // Multi select display
        for (let i = 0; i < this.labelCount; i++) {
          displayOption[i] = this.options.filter(
            option => option.value === this.selectedValue[i]
          )[0];
        }
        if (displayOption.length) {
          for (const option of displayOption) {
            this.displayString += option ? (option.viewValue + ',') : '';
          }
          this.displayString = this.displayString.slice(0, -1);
          if (this.selectedValue.length > 1) {
            this.displayString += ` (+${this.selectedValue.length - this.labelCount} ${this.translateService.instant('others')})`;
          }
        }
      } else {
        // Single select display
        displayOption = this.options.filter(
          option => option.value === this.selectedValue
        );
        if (displayOption.length) {
          this.displayString = displayOption[0].viewValue;
        }
      }
    } else {
      this.displayString = this.selectedOptions;
    }
    return this.displayString;
  }

  onSelectionChange(val) {
    const filteredValues = this.getFilteredOptionsValues();
    let count = 0;
    if (this.multiple) {
      this.selectedValue.filter(item => {
        if (filteredValues.includes(item)) {
          count++;
        }
      });
      this.selectAllChecked = count === this.filteredOptions.length;
    }
    this.writeValue(val.value);
    this.selectionChange.emit(this.selectedValue);
  }

}
