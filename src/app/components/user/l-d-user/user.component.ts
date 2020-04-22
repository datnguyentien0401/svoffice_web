import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Utils} from '../../../base/utils/utils';
import {SelectModel} from '../../../_models/base/select.model';
import {AutocompleteModel} from '../../../_models/base/autocomplete.model';
import {ServiceUtils} from '../../../base/utils/service.utils';
import {UiStateService} from '../../../_services/ui.state/ui.state.service';
import {ApiService} from '../../../_services/api.service';
import {UserTypeEnum} from '../../../_models/enums/UserTypeEnum';
import {UserStatusEnum} from '../../../_models/enums/UserStatusEnum';
import {User} from '../../../_models/user.model';
import {BaseSearchLayout} from "../../../base/layouts/BaseSearchLayout";
import {OrganizationModel} from "../../../_models/organization.model";
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material";
import {UserDetailComponent} from "../user-detail/user-detail.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent extends BaseSearchLayout {

  moduleName = 'user';
  buttons = [];

  columns = [
    {
      columnDef: 'stt',
      header: 'stt',
      title: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
      cell: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
      className: 'mat-column-stt'
    },
    {
      columnDef: 'username', header: 'username', title: (e: User) => `${e.username}`,
      cell: (e: User) => `${e.username}`,
      className: 'mat-column-username'
    },
    {
      columnDef: 'firstName', header: 'firstName', title: (e: User) => `${e.firstName}`,
      cell: (e: User) => `${e.firstName}`,
      className: 'mat-column-firstName'
    },
    {
      columnDef: 'lastName', header: 'lastName', title: (e: User) => `${e.lastName}`,
      cell: (e: User) => `${e.lastName}`,
      className: 'mat-column-lastName'
    },
    {
      columnDef: 'tel', header: 'tel', title: (e: User) => `${e.tel}`,
      cell: (e: User) => `${e.tel}`,
      className: 'mat-column-tel'
    },
    {
      columnDef: 'email', header: 'email', title: (e: User) => `${e.email}`,
      cell: (e: User) => `${e.email}`,
      className: 'mat-column-email'
    },
    {
      columnDef: 'type', header: 'type',
      title: (e: User) => `${this.utils.getEnumValueTranslated(UserTypeEnum, e.type)}`,
      cell: (e: User) => `${this.utils.getEnumValueTranslated(UserTypeEnum, e.type)}`,
      className: 'mat-column-email'
    },
    {
      columnDef: 'organization',
      header: 'organization',
      title: (e: User) => `${e.organization ? e.organization.name : ''}`,
      cell: (e: User) => `${e.organization ? e.organization.name : ''}`,
      className: 'mat-column-organization'
    },
    {
      columnDef: 'status',
      header: 'status',
      title: (e: User) => `${this.utils.getEnumValueTranslated(UserStatusEnum, e.status === true ? '1' : '0')}`,
      cell: (e: User) => `${this.utils.getEnumValueTranslated(UserStatusEnum, e.status === true ? '1' : '0')}`,
      className: 'mat-column-status'
    },
    {
      columnDef: 'file', header: 'file',
      title: (e: User) => `${e.signatureFile.fileName}`,
      cell: (e: User) => `${e.signatureFile.fileName}`,
      className: 'mat-column-file'
    },
  ];


  statusValues: SelectModel[] = [];
  typeValues: SelectModel[] = [];
  organizationValues: AutocompleteModel[] = [];


  constructor(protected formBuilder: FormBuilder, protected router: Router, protected apiService: ApiService,
              protected utils: Utils, protected serviceUtils: ServiceUtils, protected uiStateService: UiStateService,
              protected translateService: TranslateService, public dialog: MatDialog) {
    super(router, apiService, utils, serviceUtils, uiStateService, translateService);

    this.buttons.push(
      {
        columnDef: 'reset-pass',
        color: 'warn',
        icon: 'loop',
        click: 'resetPass',
        disabled: (e: User) => !(AuthoritiesUtils.hasAuthority('post/users/reset-pass')),
        display: (e: User) => true
      },
      {
        columnDef: 'edit',
        color: 'warn',
        icon: 'edit',
        click: 'addOrEdit',
        header: {
          columnDef: 'add',
          icon: 'add',
          color: 'warn',
          click: 'addOrEdit',
          display: (e: User) => AuthoritiesUtils.hasAuthority('post/users')
        },
        disabled: (e: User) => !AuthoritiesUtils.hasAuthority('patch/users'),
        display: (e: User) => true

      },
      {
        columnDef: 'deactivate',
        color: 'warn',
        icon: 'clear',
        click: 'deactivate',
        disabled: (e: User) => (!AuthoritiesUtils.hasAuthority('put/users/deactivate')) ||
          Utils.getEnumValue(UserStatusEnum, e.status === true ? '1' : '0') !== UserStatusEnum._1,
        display: (e: User) => true
      },
      {
        columnDef: 'onRowClick',
        color: 'warn',
        icon: 'visibility',
        click: 'onRowClick',
        display: (e: User) => e && AuthoritiesUtils.hasAuthority('get/users/{username}'),
      },
    );
  }

  async ngOnInit() {
    // Khởi tạo form rỗng trước
    this.searchForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      lastName: [''],
      tel: [''],
      email: [''],
      status: [''],
      type: [''],
      organization: ['']
    });

    Object.keys(UserStatusEnum).forEach(key => {
      const value = Utils.getEnumValue(UserStatusEnum, key.replace('_', ''));
      this.translateService.get(value).subscribe(res => {
        this.statusValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });
    Object.keys(UserTypeEnum).forEach(key => {
      const value = Utils.getEnumValue(UserTypeEnum, key.replace('_', ''));
      this.translateService.get(value).subscribe(res => {
        this.typeValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });
    const organizations = await this.apiService.get('/organizations/all', null).toPromise() as OrganizationModel[];
    const tempOrg = [];
    organizations.forEach((organization: OrganizationModel) => {
      tempOrg.push(new AutocompleteModel(organization.id, organization.code + ' - ' + organization.name));
    });
    this.organizationValues = tempOrg;

    // Gọi Super để xem nếu form có lưu trạng thái trước đó thì load còn không thì tự set giá trị riêng
    super.ngOnInit();

    // Cái này thích gọi lần đầu thì gọi không thì thôi ^^
    this.onSubmit();
  }

  onSubmit() {
    this.isResetPaging = true;
    this.search();
  }

  search() {
    const status = this.searchForm.get('status').value;
    const type = this.searchForm.get('type').value;
    const organization = this.searchForm.get('organization').value;
    const params = new HttpParams()
      .set('username', this.searchForm.get('username').value)
      .set('firstName', this.searchForm.get('firstName').value)
      .set('lastName', this.searchForm.get('lastName').value)
      .set('tel', this.searchForm.get('tel').value)
      .set('email', this.searchForm.get('email').value)
      .set('status', `${status ? status : ''}`)
      .set('type', `${type ? type : ''}`)
      .set('organizationId', `${organization ? organization : ''}`);
    this._fillData('/users', params);
  }

  addOrEdit(user: User) {
    if (user) {
      this.router.navigate([this.router.url, 'edit', user.username]);
    } else {
      this.router.navigate([this.router.url, 'add']);
    }
    this.search();
  }

  deactivate(user: User) {
    this.serviceUtils.execute(this.apiService.post('/users/deactivate', user),
      this.onSuccessFunc, this.moduleName + '.success.deactivate',
      this.moduleName + '.confirm.deactivate');
  }

  resetPass(user: User) {
    this.serviceUtils.execute(this.apiService.post('/users/reset-pass', user),
      this.onSuccessFunc, this.moduleName + '.success.reset-pass',
      this.moduleName + '.confirm.reset-pass');
  }

  onRowClick(user: User) {
    // this.router.navigate([this.router.url, row.id]);
    this.openDialog(user);
  }

  openDialog(user: User): Observable<any> {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      width: '80%',
      maxWidth: '80%',
      height: '90%',
      maxHeight: '90%',
      data: user,
    });
    return dialogRef.afterClosed();
  }
}
