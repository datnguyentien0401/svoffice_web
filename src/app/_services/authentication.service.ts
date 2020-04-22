import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import {AppSettings} from '../app.settings';
import {Page} from "../_models/base/Page";


@Injectable()
export class AuthenticationService {
  public static requests: HttpRequest<any>[];

  constructor(private http: HttpClient) {
    AuthenticationService.requests = [];
  }

  login(loginPayload) {
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded'
    };
    console.log(loginPayload);
    return this.http.post(AppSettings.BASE_AUTHORIZATION_URL + '/oauth/token', loginPayload, {headers});
  }

  isAuthenticated() {
    if (window.sessionStorage.getItem('token') != null) {
      return true;
    }
    return false;
  }

  userMe() {
    return this.http.get(AppSettings.BASE_AUTHORIZATION_URL + '/user/me');
  }

  findRole() {
    const params = new HttpParams().set('clientId', AppSettings.CLIENT_ID).set('pageNumber', '0').set('pageSize', '8888');
    return this.http.get<Page>(AppSettings.BASE_AUTHORIZATION_URL + '/role/find', {params});
  }
}
