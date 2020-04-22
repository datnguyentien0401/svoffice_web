import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceUtils {

  constructor(private transService: TranslateService, private toastr: ToastrService) {
  }

  public strFormat(str: string, replacement: string[]) {
    let a = this.transService.instant(str);
    if (replacement === null || replacement === undefined || replacement.length === 0) {
      return a;
    }

    for (const k in replacement) {
      a = a.replace('{' + k + '}', this.transService.instant(replacement[k]));
    }
    return a;
  }

  public showLoading() {
    Swal.fire({
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
  }

  public hideLoading() {
    Swal.close();
  }

  public onSuccessFunc = (onSuccessMessage: string): void => {
    const msg = this.transService.instant(onSuccessMessage);
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.toastr.success(msg);
  }

  public showError = (err: string): void => {
    let errLocale = '';
    if (err !== undefined && err !== null) {
      errLocale = this.transService.instant(err);
    }
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: errLocale,
      footer: '<a href>Why do I have this issue?</a>'

    });
  }

  private execute3(apiCall: any, onSuccessFunc: (this: void, data: any, onSuccessMessage?: string) => void, onSuccessMessage: string) {

    if (!apiCall) {
      if (onSuccessFunc) {
        onSuccessFunc(null);
      }
      return;
    }
    this.showLoading();
    apiCall.subscribe((data: any) => {
      if (onSuccessFunc) {
        if (onSuccessMessage) {
          onSuccessFunc(data, onSuccessMessage);
        } else {
          onSuccessFunc(data);
        }
      } else {
        this.onSuccessFunc(onSuccessMessage);
      }
      this.hideLoading();
    }, error1 => {
      this.hideLoading();
      if (error1 !== '401') {
        this.showError(error1);
      }
    });
  }

  public execute(apiCall: any, onSuccessFunc: (this: void, d: any, onSuccessMessage?: string) => void, onSuccessMessage: string,
                      confirmMsg: string, confirmMsgParamsFormat: string[] = null,
                      confirmDialogButtonOk: string = 'common.OK', confirmDialogButtonCancel: string = 'common.Cancel'
  ) {
    if (confirmMsg !== undefined && confirmMsg !== null && confirmMsg !== '') {
      this.showConfirmDialog(confirmMsg, confirmMsgParamsFormat, confirmDialogButtonOk, confirmDialogButtonCancel).then((result) => {
        if (result.value) {
          this.execute3(apiCall, onSuccessFunc, onSuccessMessage);
        }
      });
    } else {
      this.execute3(apiCall, onSuccessFunc, onSuccessMessage);
    }

  }


  public showConfirmDialog(str1: string, replacement: string[],
                           strOkText: string = 'common.OK', strCancelTex: string = 'common.Cancel'
  ) {
    const str = this.strFormat(str1, replacement);
    const strOk = this.transService.instant(strOkText);
    const strCancel = this.transService.instant(strCancelTex);
    return Swal.fire({
      title: str,
      imageUrl: 'assets/files/mStoreIcon.png',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      imageHeight: 170,
      confirmButtonText: strOk,
      cancelButtonText: strCancel
    });
  }
}
