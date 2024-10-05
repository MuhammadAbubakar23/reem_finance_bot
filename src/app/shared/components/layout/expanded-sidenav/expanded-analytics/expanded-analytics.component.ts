import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { ChatVisibilityService } from '../../../../../core/services/chat-visibility.service';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';
declare var toggleNavPanel: any;
@Component({
  selector: 'app-expanded-analytics',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './expanded-analytics.component.html',
  styleUrls: ['./expanded-analytics.component.scss']
})
export class ExpandedAnalyticsComponent {

  activeIndex: any = 0;
  isActive = false;
  activeParentIndex: number | null = 0;
  activeChildIndex: number | null = 0;
  expandedIndex: number | null = 0;
  public activeTab: any;
  headerTitle = "Conversations"
  subMenus = JSON.parse(localStorage.getItem("analyticsSubMenus") || '[]');

  constructor(private storageService: AuthService, private sidenavService: SidenavService, private chatVisibilityService: ChatVisibilityService, private route: ActivatedRoute, private router: Router) {
  }


  ngOnInit(): void {
    // this.storageService.subMenus$.subscribe(subMenus => {
    //   this.subMenus = subMenus;
    // });
    this.storageService.subMenus$.subscribe(subMenus => {
      this.subMenus =[];
      this.subMenus.push(subMenus[0],subMenus[subMenus.length-1],
        {
          "mainId": 715,
          "type": null,
          "name": "BI Analytics",
          "norm": null,
          "slug": "power-bi",
          "link": "power-bi",
          "emerging": null,
          "parentId": 706,
          "baseId": 4,
          "typeId": null,
          "isSelected": false,
          "countUser": null,
          "isDisabled": false,
          "icon": "fa-light fa-chart-line-up pe-2",
          "indexNo": 0,
          "subMenu": null,
          "permission": null,
          "id": 0
        },);
      console.log(this.subMenus);
    });
    const segments = this.router.url.split('/').filter(segment => segment);
    const lastTwoSegments = segments.slice(-1).join('/');
    this.subMenus.forEach((menu: any, parentIndex: any) => {
      if (menu.link === lastTwoSegments) {
        this.activeParentIndex = parentIndex;
        this.activeChildIndex = null;
      }
    });

    this.chatVisibilityService.refreshHistoryArray = [];
  }

  toggleCollapse(index: number) {
    this.activeParentIndex = index;
  }
  toggle() {
    ;
  }

  toggleNavTest() {
    toggleNavPanel();
  }

}
