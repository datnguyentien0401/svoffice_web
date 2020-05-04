import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material';
import {ApiService} from '../_services/api.service';
import {OAuth2AuthenticationDto} from '../_models/base/oAuth2AuthenticationDto';
import {Menu} from '../_models/base/menu';
import {NavService} from '../_services/nav.service';
import {AppSettings} from '../app.settings';
import {NavItem} from "../_models/base/nav.item";
import {ServiceUtils} from "../base/utils/service.utils";
import {StatisticModel} from "../_models/statistic.model";
import {Page} from "../_models/base/Page";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    remember: new FormControl('')
  });
  error: string | null;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router,
              private authenticationService: AuthenticationService, private apiService: ApiService,
              private cookieService: CookieService, private location: Location, private translateService: TranslateService,
              private navService: NavService, protected serviceUtils: ServiceUtils, private http: HttpClient) {
  }

  submit() {
    if (this.form.valid) {
      const body = new HttpParams()
        .set('username', this.form.controls.username.value)
        .set('password', this.form.controls.password.value)
        .set('grant_type', 'password');

      this.authenticationService.login(body.toString()).subscribe(data => {
        window.sessionStorage.setItem('token', JSON.stringify(data));
        this.cookieService.set('remember', this.form.controls.remember.value.toString());
        this.getMenu();
        this.hideLoginModal();

      if (AuthenticationService.requests) {
          AuthenticationService.requests.forEach(request => {
            console.log(request.url);
          });
        }
        console.log(this.location.isCurrentPathEqualTo('/logout'));
        if (this.location.isCurrentPathEqualTo('/logout')) {
          this.router.navigate(['/home']);
          // this.location.back();
        }

        this.cookieService.set('username', this.form.controls.username.value);
      }, error => {
        console.log(error);
        this.translateService.get('login.error').subscribe(e => {
          this.error = e;
        });
      });

    }
  }


  getMenu() {
    this.apiService.getJSON('assets/Menus.json').subscribe((data: NavItem[]) => {
      this.authenticationService.userMe().subscribe((me: OAuth2AuthenticationDto) => {
        AppSettings.AUTHORITIES.length = 0;

        me.authorities.forEach(authority => {
          AppSettings.AUTHORITIES.push(authority.authority.toLowerCase());
        });

        let menus = [];
        for (const role of me.userAuthentication.principal.roles) {
          for (const menu of role.menus) {
            menus.push(menu);
          }
        }
        menus = menus.filter(menu => menu.appType === 'WEB');
        data = this.getRoleMenu(data, menus);
        this.navService.navItems = data;
      });
    });
  }

  getRoleMenu(navItems: NavItem[], menus: Menu[]) {
    const result = [];
    for (const navItem of navItems) {
      const flag = menus.filter(menu => menu.code === navItem.roleMenu);
      if (flag && flag.length > 0) {
        if (navItem.children && navItem.children.length > 0) {
          navItem.children = this.getRoleMenu(navItem.children, menus);
        }
        result.push(navItem);
      }
    }
    return result;
  }

  ngOnInit() {
    window.sessionStorage.removeItem('token');
    this.cookieService.delete('username');

  }

  showLoginModal() {
    return this.dialog.open(LoginComponent, {disableClose: true});
  }

  hideLoginModal() {
    this.dialog.closeAll();
  }
}
