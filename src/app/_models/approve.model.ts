import * as uuid from 'uuid';

export class ApproveModel {
  clientRequestId: string;
  msisdn: string;
  otp: string;
  key: string;

  constructor(msidn: string) {
    this.clientRequestId = uuid.v4();
    this.msisdn = msidn;
  }
}
