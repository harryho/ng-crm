import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  imports: [TablerIconsModule, MaterialModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges {
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() item: NavItem | any;

  expanded: any = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() depth: any;

  constructor(public router: Router) {}

  ngOnChanges() {
    // expansion (parent/child accordion) is now driven purely by the
    // current URL prefix at render time. Using indexOf startsWith matches
    // the previous behaviour for child-route auto-expansion; ngOnChanges
    // runs once per @Input() change, which is enough since parent
    // nav-items re-render their children whenever the route list changes.
    const url = this.router.url || '';
    if (this.item && this.item.route) {
      this.expanded = url.indexOf(`/${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      // Navigation now happens via [routerLink] on the <a>; no manual
      // navigate() call needed here.
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    if (!this.expanded && window.innerWidth < 1024) {
      this.notify.emit();
    }
  }

  openExternalLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}