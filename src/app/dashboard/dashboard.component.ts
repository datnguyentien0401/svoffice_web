import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {TdMediaService} from '@covalent/core';
import {MatDialog, MatIconRegistry, MatTableDataSource} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from '../_services/api.service';
import {DatePipe} from '@angular/common';
import {JsogService} from 'jsog-typescript';
import {OrganizationModel} from "../_models/organization.model";
import {StatisticModel} from "../_models/statistic.model";
import {AppSettings} from "../app.settings";
import {ServiceUtils} from "../base/utils/service.utils";
import {TranslateService} from "@ngx-translate/core";
import {User} from "../_models/user.model";
import {CookieService} from "ngx-cookie-service";
import {HttpParams} from "@angular/common/http";
import {SuperEntity} from "../_models/base/SuperEntity";
import {NotificationModel} from "../_models/notification.model";
import {Observable} from "rxjs";
import {OtpComponent} from "../components/otp/otp.component";
import {PasswordComponent} from "../components/password/password.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  times: any;
  multi: any;
  // Timeframe
  // dateFrom: Date = new Date(new Date().getTime() - (2 * 60 * 60 * 24 * 1000));
  // dateTo: Date = new Date(new Date().getTime() - (1 * 60 * 60 * 24 * 1000));
  // imgs: any;

  statistic: StatisticModel;
  user: User;
  private notifications: NotificationModel[];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private serviceUtils: ServiceUtils,
    private transService: TranslateService,
    private dialog: MatDialog,
    private cookieService: CookieService) {
  }

  ngAfterViewInit(): void {


  }

  // axisDate(val: string): string {
  //   return new DatePipe('en').transform(val, 'hh a');
  // }

  async ngOnInit() {
    this.statistic =  await this.apiService.get('/requisitions/statistic', null).toPromise() as StatisticModel;
    if (this.statistic.signDoc != 0) {
      this.serviceUtils.onSuccessFunc(this.statistic.signDoc + ' ' + this.transService.instant('signDocNotification'));
    }
    this.user = await this.apiService.get('/users/' + this.cookieService.get('username'), null).toPromise() as User;
    const params = new HttpParams()
      .append('pageNumber', '1')
      .append('pageSize', '5');

    this.apiService.getPaging('/notifications/', params).subscribe(
      res => {
        console.log(res);
        this.notifications = res.content;
      }
    )
  }

  changePass(): Observable<any> {
    const dialogRef = this.dialog.open(PasswordComponent, {
      width: '30%',
      maxWidth: '30%',
      height: '75%',
      maxHeight: '75%',
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }
}
