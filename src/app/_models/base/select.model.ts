export class SelectModel {
  value: any;
  viewValue: string;
  disabled: boolean | undefined;

  constructor(value: any, displayValue: string, disabled?: boolean) {
    this.value = value;
    this.viewValue = displayValue;
    this.disabled = disabled;
  }
}
