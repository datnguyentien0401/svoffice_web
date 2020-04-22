import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppSettings} from '../app.settings';
import {Observable} from 'rxjs';
import {FileSaverService} from 'ngx-filesaver';
import {Page} from "../_models/base/Page";


@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private fileSaver: FileSaverService) {
  }

  getFullUrl(url: string) {
    return AppSettings.BASE_URL + url;
  }

  get(nativeUrl: string, params: HttpParams) {
    return this.http.get(this.getFullUrl(nativeUrl), {params});
  }

  getPaging(nativeUrl: string, params: HttpParams) {
    return this.http.get<Page>(this.getFullUrl(nativeUrl), {params});
  }

  post(nativeUrl: string, obj: any, params?: { [param: string]: string | string[] } | HttpParams) {
    return this.http.post(this.getFullUrl(nativeUrl), obj, {params});
  }

  postHeader(nativeUrl: string, obj: any, pars?: {
               headers?: HttpHeaders | {
                 [header: string]: string | string[];
               };
               observe?: any;
               responseType?: any;
               params?: { [param: string]: string | string[] }
             }
  ) {
    return this.http.post(this.getFullUrl(nativeUrl), obj, {headers: pars.headers, params: pars.params});
  }

  patch(nativeUrl: string, obj: any) {
    return this.http.patch(this.getFullUrl(nativeUrl), obj);
  }

  put(nativeUrl: string, obj: any) {
    return this.http.put(this.getFullUrl(nativeUrl), obj);
  }

  delete(nativeUrl: string) {
    return this.http.delete(this.getFullUrl(nativeUrl));
  }

  getJSON(file: string): Observable<any> {
    return this.http.get(file);
  }

  postBlob(nativeUrl: string, obj: any, options: { headers?: HttpHeaders; params?: HttpParams }): Observable<HttpResponse<Blob>> {

    return this.http.post(this.getFullUrl(nativeUrl), obj, {
      headers: options.headers,
      params: options.params,
      observe: 'response',
      responseType: 'blob'
    });
  }

  downloadExcel(filename: string): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/vnd.ms-excel; charset=utf-8');

    return this.http.get(AppSettings.BASE_URL + '/download/excel/' + filename, {
      headers,
      responseType: 'blob'
    });
  }


  saveFile(nativeUrl: string, obj: any, options: { headers?: HttpHeaders; params?: HttpParams }) {
    this.http.post(this.getFullUrl(nativeUrl), obj, {
      headers: options.headers,
      params: options.params,
      observe: 'response',
      responseType: 'blob'
    }).subscribe(l => {
      console.log(l.headers.get('Content-Type'));
      console.log(l.headers.get('Content-Disposition'));
      let filename = '';
      const disposition = l.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      console.log(filename);
      this.fileSaver.save(l.body, filename, l.headers.get('Content-Type'));
    });
  }


}
