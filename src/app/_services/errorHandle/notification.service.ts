import { Injectable, NgZone } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastr: ToastrService,
    protected translateService: TranslateService,
    private zone: NgZone
  ) {
    // const msg = this.translateService.instant(this.entity + '.' + this.actionType + '.success');
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    // this.toastr.success(msg);
  }

  showSuccess(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.toastr.info(message);
    });
  }

  showError(message: string): void {

    this.zone.run(() => {
      const localeMsg = this.translateService.instant(message);
      this.toastr.error(localeMsg);
    });
  }
}
