import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {HttpParams} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material";
import {BaseSearchLayout} from "../../../base/layouts/BaseSearchLayout";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {ApiService} from "../../../_services/api.service";
import {UiStateService} from "../../../_services/ui.state/ui.state.service";
import {Utils} from "../../../base/utils/utils";
import {User} from "../../../_models/user.model";
import {Paging} from "../../../_models/base/Paging";

@Component({
  selector: 'app-receive-user-requisition',
  templateUrl: './receive-user-requisition.component.html',
  styleUrls: ['./receive-user-requisition.component.scss'],
  providers: [DatePipe]
})
export class ReceiveUserRequisitionComponent extends BaseSearchLayout {

  moduleName = 'receive-user';

  columns = [];
  buttons = [];

  usernames: string;
  @Input() usernameChanged: EventEmitter<string>;

  @Input() set usernameList(value: string) {
    console.log(value);
    if (value) {
      this.usernames = value;
      this.search();
    }
  }

  constructor(protected formBuilder: FormBuilder, protected router: Router, protected apiService: ApiService,
              protected utils: Utils, protected serviceUtils: ServiceUtils, protected uiStateService: UiStateService,
              protected translateService: TranslateService, public dialog: MatDialog) {
    super(router, apiService, utils, serviceUtils, uiStateService, translateService);
    this.columns.push(
      {
        columnDef: 'stt',
        header: 'stt',
        title: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
        cell: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
        className: 'mat-column-stt'
      },
      {
        columnDef: 'name', header: 'name', title: (e: User) => (`${e.lastName}` + ' ' + `${e.firstName}`),
        cell: (e: User) => `${e.lastName + ' ' + e.firstName}`,
        className: 'mat-column-id'
      },
      {
        columnDef: 'org', header: 'org',
        title: (e: User) => `${e.organization.name}`,
        cell: (e: User) => `${e.organization.name}`,
        className: 'mat-column-org'
      },
    );

  }

  ngOnInit = async () => {
    this.searchForm = this.formBuilder.group({});
    super.ngOnInit();
    console.log(this.usernameChanged);
    if (this.usernameChanged) {
      this.usernameChanged.subscribe(data => {
        this.usernames = data;
      });
      this.search();
    }

  };

  search() {
    const params = new HttpParams()
      .set("usernameList", this.usernames);
    this._fillData('/users/username-list', params);

  }

}
