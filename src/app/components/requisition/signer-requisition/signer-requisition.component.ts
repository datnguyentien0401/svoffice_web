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
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {RequisitionModel} from "../../../_models/requisition.model";
import {AppSettings} from "../../../app.settings";
import {SuperEntity} from "../../../_models/base/SuperEntity";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-signer-requisition',
  templateUrl: './signer-requisition.component.html',
  styleUrls: ['./signer-requisition.component.scss'],
  providers: [DatePipe]
})
export class SignerRequisitionComponent extends BaseSearchLayout {

  moduleName = 'sign-user';

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

  @Input() isDetail: boolean;
  @Output() signLevelUp: EventEmitter<number> = new EventEmitter();
  @Output() signLevelDown: EventEmitter<number> = new EventEmitter();

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

    this.buttons.push(
      {
        columnDef: 'up',
        color: 'warn',
        icon: 'vertical_align_top',
        click: 'changeLevelSignUp',
        title: 'Up',
        disabled: (o: User) => this.isPermissionUp(o),
        display: (o: User) => true,
      },
      {
        columnDef: 'down',
        color: 'warn',
        icon: 'vertical_align_bottom',
        click: 'changeLevelSignDown',
        title: 'Down',
        display: (o: User) => true,
        disabled: (o: User) => this.isPermissionDown(o)
      },
    );

  }

  isPermissionUp (user: User): boolean{
    const data = this.results.data as [User];
    const idx = data.indexOf(user);
    return this.isDetail || idx == 0;
  }

  isPermissionDown (user: User): boolean{
    const data = this.results.data as [User];
    const idx = data.indexOf(user);
    return this.isDetail || idx == data.length - 1;
  }

  changeLevelSignUp(user: User) {
    console.log(this.results.data);
    const data = this.results.data as [User];
    const idx = data.indexOf(user);
    this.results.data = AppSettings.array_move(this.results.data, idx, idx - 1);
    this.signLevelUp.emit(idx);
  };

  changeLevelSignDown(user: User) {
    console.log(this.results.data);
    const data = this.results.data as [User];
    const idx = data.indexOf(user);
    this.results.data = AppSettings.array_move(this.results.data, idx, idx + 1);
    this.signLevelDown.emit(idx);
  };


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
    if (!this.usernames) {
      return;
    }
    let usernameArr :string[] = this.usernames.split(",");
    const params = new HttpParams()
      .set("usernameList", this.usernames)
      .set('pageNumber', this.isResetPaging ? '1' : (this.paging ? this.paging.pageNumber.toString() : '1'))
      .set('pageSize', this.paging ? this.paging.pageSize.toString() : AppSettings.PAGE_SIZE.toString());

    this.apiService.getPaging('/users/username-list', params)
      .subscribe(data => {
        console.log(data.content);
        this.isResetPaging = false;
        this.results = new MatTableDataSource<SuperEntity>(data.content.sort(function(a, b){
          return usernameArr.indexOf(a.username) - usernameArr.indexOf(b.username);
        }));
        this.paging.pageSize = data.size;
        this.paging.pageNumber = data.number + 1;
        this.paging.totalElements = data.totalElements;
      });
  }

}
