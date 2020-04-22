import {AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, ViewChild} from '@angular/core';
import {NavService} from './_services/nav.service';
import {Router} from '@angular/router';
import {ApiService} from './_services/api.service';
import {AuthenticationService} from './_services/authentication.service';
import {LoginComponent} from './login/login.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;
  @HostBinding('class') componentCssClass;
  subscription: Subscription;

  constructor(public overlayContainer: OverlayContainer, private navService: NavService, private router: Router,
              private authenticationService: AuthenticationService, private apiService: ApiService,
              private loginComponent: LoginComponent, private location: Location) {

  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
    if (this.authenticationService.isAuthenticated()) {
      if (this.location.isCurrentPathEqualTo('/')) {
        this.router.navigate(['home']);
      }
    } else {
      const dlgRef = this.loginComponent.showLoginModal();
      dlgRef.afterClosed().subscribe(result => {
        this.onMouseLeave();
      });
    }
    if (!this.navService.navItems) {
      this.loginComponent.getMenu();
      this.onMouseLeave();
    }
    this.listenRouting();
  }

  changeTheme(theme) {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item !== 'cdk-overlay-container');
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(theme);
    this.componentCssClass = theme;
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  get navItems() {
    return this.navService.navItems;
  }

  listenRouting() {
    let routerUrl: string;
    let routerList: Array<any>;
    let target: any;
    this.router.events.subscribe((routerValue: any) => {
      routerUrl = routerValue.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {

        target = this.navService.navItems;
        this.navService.breadcrumbList.length = 0;
        routerList = routerUrl.slice(1).split('/');

        for (let index = 0; index < routerList.length; index++) {
          const item = routerList[index];
          if (target) {
            for (const menu of target) {
              target = this.findMenu(item, menu); // target.find(page => page.route === item);
              if (target) {
                break;
              }
            }
          }
          let path;
          if (target) {
            path = target.route;
          }

          this.navService.breadcrumbList.push({
            name: target ? target.displayName : item,
            path: (index === 0) ? path : `${this.navService.breadcrumbList[index - 1].route}/${path}`
          });
          if (!target) {
            break;
          }
          if (index + 1 !== routerList.length) {
            target = target.children;
          }
        }

      }
    });
  }


  findMenu(id, currentNode) {
    let i;
    let currentChild;
    let result;

    if (id === currentNode.route) {
      return currentNode;
    } else {
      if (!currentNode.children) {
        return false;
      }
      // Use a for loop instead of forEach to avoid nested functions
      // Otherwise "return" will not work properly
      for (i = 0; i < currentNode.children.length; i += 1) {
        currentChild = currentNode.children[i];

        // Search in the current child
        result = this.findMenu(id, currentChild);

        // Return the result if the node has been found
        if (result !== false) {
          return result;
        }
      }

      // The node has not been found and we have no more autocompleteModels
      return false;
    }
  }

  onMouseEnter() {
    this.navService.navItems.forEach(item => {
      item.isOnlyIcon = false;
    });
  }

  onMouseLeave() {
    if (this.navService.navItems) {
      this.navService.navItems.forEach(item => {
        item.isOnlyIcon = true;
      });
    }
  }
}
