export class ButtonClickModel {
  action: string;
  object: any;
  index: number | undefined;
  constructor(action: string, object: any, index?: number) {
    this.action = action;
    this.object = object;
    this.index = index;
  }
}
