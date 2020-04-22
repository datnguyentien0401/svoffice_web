import {Component, OnInit} from '@angular/core';
import {NavService} from '../../_services/nav.service';
import {TranslateService} from '@ngx-translate/core';
import {AppSettings} from '../../app.settings';
import {CookieService} from 'ngx-cookie-service';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  selectedLanguage: string;

  currentTheme: string;
  appsetting = AppSettings;

  constructor(public navService: NavService, private translate: TranslateService,
              public cookieService: CookieService, private appComponent: AppComponent, private router: Router) {
    if (this.cookieService.get('lang') === 'undefined' || this.cookieService.get('lang') === '') {
      translate.setDefaultLang(AppSettings.DEFAULT_LANGUAGE);
      this.selectedLanguage = AppSettings.DEFAULT_LANGUAGE;
      this.cookieService.set('lang', AppSettings.DEFAULT_LANGUAGE);
      AppSettings.CURR_LANG = this.cookieService.get('lang');
    } else {
      translate.setDefaultLang(this.cookieService.get('lang'));
      this.selectedLanguage = this.cookieService.get('lang');
      AppSettings.CURR_LANG = this.selectedLanguage;
    }

    if (this.cookieService.get('theme') === 'undefined' || this.cookieService.get('theme') === '') {
      this.currentTheme = AppSettings.DEFAULT_THEME;
    } else {
      this.currentTheme = this.cookieService.get('theme');
    }

    appComponent.changeTheme(this.currentTheme);
    this.cookieService.set('theme', this.currentTheme);
  }

  ngOnInit() {

  }

  onChangeLanguage(event) {
    this.translate.use(event.value);
    this.selectedLanguage = event.value;
    this.cookieService.set('lang', event.value);
    AppSettings.CURR_LANG = event.value;
  }

  onChangeTheme(event) {
    this.currentTheme = event.value;
    this.appComponent.changeTheme(this.currentTheme);
    this.cookieService.set('theme', this.currentTheme);
  }
  goToHome() {
    this.router.navigate(['home']);
  }


}
