import {AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ApiService} from '../../_services/api.service';
import {Utils} from '../utils/utils';
import {ServiceUtils} from '../utils/service.utils';
import {UiStateService} from '../../_services/ui.state/ui.state.service';
import {TranslateService} from '@ngx-translate/core';
import {Paging} from '../../_models/base/Paging';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material';
import {SuperEntity} from '../../_models/base/SuperEntity';
import {ButtonClickModel} from '../../_models/base/button.click.model';
import {AppSettings} from '../../app.settings';

export class BaseSearchLayout implements OnInit, OnDestroy, AfterViewInit {

  protected moduleName: string;

  protected unsubscribe$ = new Subject();
  protected searchForm: FormGroup;

  protected isResetPaging: boolean;
  protected paging: Paging;

  protected results: any;

  constructor(protected router: Router, protected apiService: ApiService, protected utils: Utils,
              protected serviceUtils: ServiceUtils, protected uiStateService: UiStateService,
              protected translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.uiStateService.uiState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(state => {
        if (state && this.router.url.indexOf(state.moduleName) >= 0) {
          if (!this.searchForm) {
            this.searchForm = Utils.cloneAbstractControl(state.formGroup);
          } else {
            const formGroup = Utils.cloneAbstractControl(state.formGroup);
            const formControls = formGroup.controls;
            Object.keys(formControls).forEach(key => {
              this.searchForm.get(key).setValue(formControls[key].value);
            });
          }
        }
      });

  }

  ngAfterViewInit(): void {
    Object.keys(this.searchForm.controls).forEach(key => {
      this.searchForm.get(key).valueChanges.subscribe(
        value => {
          this.isResetPaging = true;
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.uiStateService.setUiState$({moduleName: this.moduleName, formGroup: this.searchForm});
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    this.isResetPaging = true;
    this.search();
  }

  search() {
    // Form extends will be override custom by business
  }

  _fillData(nativeUrl: string, params: HttpParams) {
    params = params
      .append('pageNumber', this.isResetPaging ? '1' : (this.paging ? this.paging.pageNumber.toString() : '1'))
      .append('pageSize', this.paging ? this.paging.pageSize.toString() : AppSettings.PAGE_SIZE.toString());

    this.apiService.getPaging(nativeUrl, params)
      .subscribe(data => {
        console.log(data);
        this.isResetPaging = false;
        this.results = new MatTableDataSource<SuperEntity>(data.content);
        this.paging.pageSize = data.size;
        this.paging.pageNumber = data.number + 1;
        this.paging.totalElements = data.totalElements;
      });
  }

  pagingChange(event: Paging) {
    if (this.paging) {
      this.paging = event;
      this.search();
    } else {
      this.paging = event;
    }
  }

  onClick(event: ButtonClickModel) {
    const window = this as any;
    if (window[event.action]) {
      window[event.action](event.object, event.index);
    }
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    this.search();
  }

}
