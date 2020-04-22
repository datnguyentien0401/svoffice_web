export class AutocompleteModel {
  value: string | number;
  displayValue: string;
  constructor(value: string | number, displayValue: string){
    this.value = value;
    this.displayValue = displayValue;
  }
}
