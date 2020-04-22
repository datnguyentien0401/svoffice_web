import {Component, OnInit} from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  template: ``,
  styles: [``]
})
export class LogoutComponent implements OnInit {
  constructor(private loginComponent: LoginComponent,
              private cookieService: CookieService) {
  }
  ngOnInit() {
    window.sessionStorage.removeItem('token');
    this.cookieService.delete('username');
    this.loginComponent.showLoginModal();
  }
}
