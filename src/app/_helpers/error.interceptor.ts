import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, map, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from '../_services/authentication.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {AppSettings} from '../app.settings';
import {LoginComponent} from '../login/login.component';
import {JsogService} from 'jsog-typescript';
import {SuperEntity} from '../_models/base/SuperEntity';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private isShowLoginModal = false;

  constructor(private router: Router, private authenticationService: AuthenticationService, private cookieService: CookieService,
              private loginComponent: LoginComponent, private jSog: JsogService, private injector: Injector) {
  }

  getAccessToken() {
    if (this.authenticationService.isAuthenticated()) {
      const json = JSON.parse(window.sessionStorage.getItem('token'));
      return json.token_type + ' ' + json.access_token;
    } else {
      return 'Basic ' + btoa(AppSettings.CLIENT_ID + ':' + AppSettings.CLIENT_SECRET);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Accept-Language': this.cookieService.get('lang'),
        Authorization: this.getAccessToken(),
      },
    });
    // if (request.body) {
    //   request = request.clone({body: this.jSog.serialize(request.body)});
    // }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && typeof event.body === 'object' && !(event.body instanceof Blob)) {
          if (event.body) {
            event = event.clone({body: this.jSog.deserializeArray(event.body, SuperEntity)});
          }
        }
        return event;
      }),
      catchError(err => {
          if (err.status === 401) {
            console.log(401);
            if (!this.refreshTokenInProgress) {
              this.refreshTokenInProgress = true;
              this.process401Error();
              return this.tokenSubject
                .pipe(
                  filter(token => token != null),
                  take(1),
                  switchMap(token => {
                    this.refreshTokenInProgress = false;
                    this.isShowLoginModal = false;
                    return next.handle(this.setAuthHeader(request));
                  })
                );
            }
          } else {
            const error = err.error.message || err.statusText;
            return throwError(error);
          }
        }
      )
    );
  }

  private setAuthHeader(request) {
    return request.clone({url: request.url, setHeaders: {Authorization: this.getAccessToken()}});
  }

  process401Error() {
    console.log('process401Error', this.tokenSubject);
    // this.tokenSubject.next(null);
    const tk = window.sessionStorage.getItem('token');
    console.log('Token', tk);
    if (tk) {
      console.log('refresh token:', tk);
      this.refreshToken().subscribe(newToken => {
          if (newToken) {
            window.sessionStorage.setItem('token', JSON.stringify(newToken));
            console.log('new token:', newToken);
            this.tokenSubject.next('1');
          }
        }, error => {
          console.log('refreshTokenError', error);
          window.sessionStorage.removeItem('token');
          this.process401Error();
        }
      );
    } else {
      if (!this.isShowLoginModal) {
        this.isShowLoginModal = true;
        const dlgRef = this.loginComponent.showLoginModal();
        dlgRef.afterClosed().subscribe(result => {
          if (window.sessionStorage.getItem('token')) {
            this.refreshTokenInProgress = false;
            this.isShowLoginModal = false;
            this.tokenSubject.next('1');
          }
        });
      }
    }
  }

  refreshToken() {
    const http = this.injector.get(HttpClient);
    const refresh_token = JSON.parse(window.sessionStorage.getItem('token')).refresh_token;
    window.sessionStorage.removeItem('token');
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded'
    };
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refresh_token);
    return http.post(AppSettings.BASE_AUTHORIZATION_URL + '/oauth/token', body.toString(), {headers});
  }
}
