import {OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Location} from '@angular/common';
import {AuthenticationService} from '../../_services/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../_services/api.service';
import {ServiceUtils} from '../utils/service.utils';
import {HttpHeaders} from "@angular/common/http";

export class BaseAddEditLayout implements OnInit {

  addEditForm: FormGroup;
  isEdit: boolean;
  id: any;

  constructor(protected activatedRoute: ActivatedRoute, protected location: Location,
              protected translateService: TranslateService, protected serviceUtils: ServiceUtils) {
    this.isEdit = false;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
    }
  }

  back(): void {
    this.location.back();
  }

  onSuccessFunc = (data: any, onSuccessMessage: string): void => {
    this.serviceUtils.onSuccessFunc(onSuccessMessage);
    setTimeout(() => {
      this.back();
    }, 1500);
  }

  hasAuthority() {
    return false;
  }
}
