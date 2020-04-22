export class SelectModel {
  value: any;
  viewValue: string;

  constructor(value: any, displayValue: string) {
    this.value = value;
    this.viewValue = displayValue;
  }
}
