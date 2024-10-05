import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { ChatVisibilityService } from '../../../../../core/services/chat-visibility.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../../../shared.module';

declare var toggleNavPanel: any;

@Component({
  selector: 'app-expanded-console',
  standalone: true,
  imports: [CommonModule,RouterModule,NgxSpinnerModule,SharedModule,FormsModule],
  templateUrl: './expanded-console.component.html',
  styleUrls: ['./expanded-console.component.scss']
})
export class ExpandedConsoleComponent {
  public activeTab: any;
  activeParentIndex: number | null = null;
  activeChildIndex: number | null = 0;
  expandedIndex: number | null = 0;

  activeIndex = 0;
  isActive = false;
  headerTitle = "Console"

  subMenus = [
    {
      DisplayName: "Bot Management", RouteName: "bot-management", expanded: false, isChild: true, class: "fa-light fa-gears pe-2",
      Children: [
        { DisplayName: "Conversational Bot", RouteName: "conversational-bot", expanded: false, isChild: false },
      ]
    },
    { DisplayName: "Connect Channels", RouteName: "connect-channels", expanded: false, isChild: false, class: "fa-light fa-message-bot pe-2", Children: [] },

    { DisplayName: "User Management", RouteName: "users", expanded: false, isChild: false, class: "fal fa-users pe-2", Children: [] },
    { DisplayName: "Tags", RouteName: "tags", expanded: false, isChild: false, class: "fal fa-tags pe-2", Children: [] },
  ];

  constructor(private sidenavService: SidenavService, private chatVisibilityServicee: ChatVisibilityService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    const segments = this.router.url.split('/').filter(segment => segment);
    const lastTwoSegments = segments.slice(-2).join('/');

    this.subMenus.forEach((menu, parentIndex) => {
      if (menu.RouteName === lastTwoSegments) {
        this.activeParentIndex = parentIndex;
        this.activeChildIndex = null;
      }

      menu.Children.forEach((child, childIndex) => {
        if (child.RouteName === lastTwoSegments) {
          this.activeParentIndex = parentIndex;
          this.activeChildIndex = childIndex;
        }
      });
    });
    this.chatVisibilityServicee.refreshHistoryArray = [];
  }

  toggleCollapse(index: number) {
    if (this.expandedIndex !== index) {
      this.expandedIndex = index;
      this.activeChildIndex = null;
    } else {
      this.expandedIndex = null;
    }
    this.activeParentIndex = index;
  }

  activeMenu(childIndex: number) {
    this.activeParentIndex = null;
    this.activeChildIndex = childIndex;
  }

  toggle() {
  }

  toggleNavTest() {
    toggleNavPanel();
  }

}
