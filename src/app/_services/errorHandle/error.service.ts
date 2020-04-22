import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  getClientErrorMessage(error: Error): string {
    return error.message ?
      error.message :
      error.toString();
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    let errorMsg: string;
    if (typeof error.error  === 'string' || error.status === 500) {
      errorMsg = 'err.' + error.error;
    } else {
      errorMsg = error.message;
    }
    return navigator.onLine ? errorMsg :
      'No Internet Connection';
  }
}
