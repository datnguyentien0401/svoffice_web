import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {ErrorService} from './error.service';
import {LoggingService} from './logging.service';
import {NotificationService} from './notification.service';
import Swal from 'sweetalert2';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }
  handleError(error: Error | HttpErrorResponse) {
    // const errorService = this.injector.get(ErrorService);
    // const logger = this.injector.get(LoggingService);
    // const notifier = this.injector.get(NotificationService);
    // Swal.close();
    // let message;
    // let stackTrace;
    // if (error instanceof HttpErrorResponse) {
    //   // Server error
    //   console.log(error);
    //   message = errorService.getServerErrorMessage(error);
    //   // stackTrace = errorService.getServerErrorStackTrace(error);
    //   notifier.showError(message);
    // } else {
    //   // Client Error
    //   message = errorService.getClientErrorMessage(error);
    //   notifier.showError(message);
    // }
    // // Always log errors
    // logger.logError(message, stackTrace);
    console.error(error);
  }
}
