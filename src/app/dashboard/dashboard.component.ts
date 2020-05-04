import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {TdMediaService} from '@covalent/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from '../_services/api.service';
import {DatePipe} from '@angular/common';
import {JsogService} from 'jsog-typescript';
import {OrganizationModel} from "../_models/organization.model";
import {StatisticModel} from "../_models/statistic.model";
import {AppSettings} from "../app.settings";
import {ServiceUtils} from "../base/utils/service.utils";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  times: any;
  multi: any;
  // Timeframe
  dateFrom: Date = new Date(new Date().getTime() - (2 * 60 * 60 * 24 * 1000));
  dateTo: Date = new Date(new Date().getTime() - (1 * 60 * 60 * 24 * 1000));
  imgs: any;

  private statistic: StatisticModel;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private serviceUtils: ServiceUtils,
    private transService: TranslateService,
    private JSOG: JsogService) {
  }

  ngAfterViewInit(): void {


  }

  axisDate(val: string): string {
    return new DatePipe('en').transform(val, 'hh a');
  }

  async ngOnInit() {
    this.statistic =  await this.apiService.get('/requisitions/statistic', null).toPromise() as StatisticModel;
    if (this.statistic.signDoc != 0) {
      this.serviceUtils.onSuccessFunc(this.statistic.signDoc + ' ' + this.transService.instant('signDocNotification'));
    }
    if (this.statistic.recvDoc != 0) {
      this.serviceUtils.onSuccessFunc(this.statistic.recvDoc + ' ' + this.transService.instant('recvDocNotification'));
    }
  }
}
