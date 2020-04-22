import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {NavItem} from '../_models/base/nav.item';

@Injectable()
export class NavService {
  public appDrawer: any;
  public title: string;
  public currentUrl = new BehaviorSubject<string>(undefined);
  public username: string;
  breadcrumbList: Array<any> = [];
  navItems: NavItem[];
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
}
