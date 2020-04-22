import {TranslateService} from '@ngx-translate/core';
import {MatTableDataSource} from '@angular/material';
import {SuperEntity} from '../../_models/base/SuperEntity';
import {Paging} from '../../_models/base/Paging';
import {Injectable} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

@Injectable()
export class Utils {

  constructor(private transService: TranslateService) {
  }

  static getEnumValue<T>(o: T, value: string): { [P in keyof T]: T[P] }[keyof T] {
    return (o as any)['_' + value]; // No type safety here unfrotunately
  }

  static calcPosition(e: any, results: MatTableDataSource<SuperEntity>, paging: Paging) {
    return ((paging.pageNumber - 1) * paging.pageSize) + (results.data.indexOf(e) + 1);
  }

  static reduceEntityAttributeForFormControl(formGroup: FormGroup, e: any) {
    return Object.keys(formGroup.controls).reduce((formControl, ctrlName) => {
      if (typeof(e[ctrlName]) === 'boolean') {
        formControl[ctrlName] = e[ctrlName] ? '1' : '0';
      } else if (typeof(e[ctrlName]) === 'object') {
        formControl[ctrlName] = e[ctrlName]
          ? (e[ctrlName].id
            ? e[ctrlName].id
            : (e[ctrlName].code ? e[ctrlName].code : ''))
          : null;
      } else {
        formControl[ctrlName] = e[ctrlName];
      }
      return formControl;
    }, {});
  }

  public getEnumValueTranslated<T>(o: T, value: string): { [P in keyof T]: T[P] }[keyof T] {
    const key = (o as any)['_' + value]; // No type safety here unfrotunately
    return this.transService.instant(key);
  }

  static cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, Utils.cloneAbstractControl(controls[key]));
      })

      newControl = formGroup as any;
    }
    else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(Utils.cloneAbstractControl(formControl)))

      newControl = formArray as any;
    }
    else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
    }
    else {
      throw new Error('Error: unexpected control value');
    }

    if (control.disabled) newControl.disable({emitEvent: false});

    return newControl;
  }
}
