import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import {Utils} from "../../../base/utils/utils";
import {ServiceUtils} from "../../../base/utils/service.utils";
import {ApiService} from "../../../_services/api.service";
import {SelectModel} from "../../../_models/base/select.model";
import {BaseSearchLayout} from "../../../base/layouts/BaseSearchLayout";
import {OrganizationModel} from "../../../_models/organization.model";
import {UiStateService} from "../../../_services/ui.state/ui.state.service";
import {OrganizationStatusEnum} from "../../../_models/enums/OrganizationStatusEnum";
import {AuthoritiesUtils} from "../../../base/utils/authorities.utils";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent extends BaseSearchLayout {

  moduleName = 'organization';
  statusValues: SelectModel[] = [];

  columns = [];
  buttons = [];

  constructor(protected formBuilder: FormBuilder, protected router: Router, protected apiService: ApiService,
              protected utils: Utils, protected serviceUtils: ServiceUtils, protected uiStateService: UiStateService,
              protected translateService: TranslateService) {
    super(router, apiService, utils, serviceUtils, uiStateService, translateService);

    this.columns.push(
      {
        columnDef: 'stt',
        header: 'stt',
        title: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
        cell: (e: any) => `${Utils.calcPosition(e, this.results, this.paging)}`,
        className: 'mat-column-stt',
      },
      {
        columnDef: 'code', header: 'code', title: (o: OrganizationModel) => `${o.code}`,
        cell: (o: OrganizationModel) => `${o.code}`,
        className: 'mat-column-code',
      },
      {
        columnDef: 'name', header: 'name', title: (o: OrganizationModel) => `${o.name}`,
        cell: (o: OrganizationModel) => `${o.name}`,
        className: 'mat-column-name',
      },
      {
        columnDef: 'status',
        header: 'status',
        title: (e: OrganizationModel) => `${this.utils.getEnumValueTranslated(OrganizationStatusEnum, e.status === true ? '1' : '0')}`,
        cell: (e: OrganizationModel) => `${this.utils.getEnumValueTranslated(OrganizationStatusEnum, e.status === true ? '1' : '0')}`,
        className: 'mat-column-status',
      },
    );

    this.buttons.push(
      {
        columnDef: 'edit',
        color: 'warn',
        icon: 'edit',
        tooltip: 'add',
        header: {
          columnDef: 'add',
          icon: 'add',
          tooltip: 'add',
          color: 'warn',
          click: 'addOrEdit',
          display: (o: OrganizationModel) => AuthoritiesUtils.hasAuthority('post/organizations'),
        },
        click: 'addOrEdit',
        display: (o: OrganizationModel) => o && AuthoritiesUtils.hasAuthority('patch/organizations/{id}'),
      },
      {
        columnDef: 'deactivate',
        color: 'warn',
        icon: 'clear',
        click: 'deactivate',
        // tslint:disable-next-line:max-line-length
        disabled: (o: OrganizationModel) => Utils.getEnumValue(OrganizationStatusEnum, o.status ? '1' : '0') !== OrganizationStatusEnum._1,
        display: (o: OrganizationModel) => o && AuthoritiesUtils.hasAuthority('put/organizations/deactivate'),
      },
    );

  }

  ngOnInit = async () => {
    this.searchForm = this.formBuilder.group({
      code: [''],
      name: [''],
      status: [''],
    });

    Object.keys(OrganizationStatusEnum).forEach(key => {
      const status = Utils.getEnumValue(OrganizationStatusEnum, key.replace('_', ''));
      this.translateService.get(status).subscribe(res => {
        this.statusValues.push(new SelectModel(key.replace('_', ''), res));
      });
    });

    super.ngOnInit();
    this.onSubmit();
  }

  search() {
    const status = this.searchForm.get('status').value;
    const params = new HttpParams()
      .set('code', this.searchForm.get('code').value)
      .set('name', this.searchForm.get('name').value)
      .set('status', `${status ? status : ''}`);
    this._fillData('/organizations', params);
  }

  addOrEdit(org: OrganizationModel) {
    console.log(this.router.url);
    if (org) {
      this.router.navigate([this.router.url, 'edit', org.id]);
    } else {
      this.router.navigate([this.router.url, 'add']);
    }
  }

  deactivate(row: OrganizationModel ) {
    this.serviceUtils.execute(this.apiService.put('/organizations/deactivate', row),
      this.onSuccessFunc, this.moduleName + '.success.deactivate',
      this.moduleName + '.confirm.deactivate');
  }
}
