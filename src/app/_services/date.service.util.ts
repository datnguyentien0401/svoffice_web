import { Inject, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import {AppSettings} from "../app.settings";

@Injectable({
  providedIn: 'root',
})
export class DateServiceUtil {
  constructor(private datePipe: DatePipe) {
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  convertDateToStringCurrentGMT(date: Date): string {
    return this.datePipe.transform(date, AppSettings.API_DATE_FORMAT);
  }

  convertDateToStringGMT0(date: Date | string): string {
    return this.datePipe.transform(date, AppSettings.API_DATE_FORMAT, '-0');
  }

  convertDateToDisplayGMT0(date: string): string {
    return this.datePipe.transform(date, AppSettings.DIS_DATE_FORMAT, '-0');
  }
}
