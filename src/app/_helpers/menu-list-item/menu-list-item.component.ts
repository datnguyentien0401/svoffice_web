import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NavService} from '../../_services/nav.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NavItem} from '../../_models/base/nav.item';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  @HostBinding('attr.aria-expanded') ariaExpanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.navService.appDrawer.opened = true;
  }

  ngOnInit() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.item.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.item.expanded;
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.navService.title = item.displayName;
      this.router.navigate([item.route]);
      // this.navService.closeNav();
    }
    if (item.children && item.children.length) {
      this.item.expanded = !this.item.expanded;
    }
  }
}
