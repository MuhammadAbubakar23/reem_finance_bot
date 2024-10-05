import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
declare function changeTheme(color: any): any

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  username = "";
  initial = ""
  email ="";
  // menus = [
  //   {
  //     Name: 'Analytics',
  //     DisplayName: 'Analytics',
  //     RouteName: '/bot/analytics/ai-bot-analytics',
  //     iconClass: 'fa-light fa-chart-line-up ice'
  //   },
  //   {
  //     Name: 'Bot Interactions',
  //     DisplayName: 'Bot Interactions',
  //     RouteName: '/bot/ai-bot/bot-interaction',
  //     iconClass: 'fa-light fa-microchip-ai ice'
  //   },
  //   {
  //     Name: 'Chat History',
  //     DisplayName: 'Chat History',
  //     RouteName: '/bot/chat-history/conversations',
  //     iconClass: 'fa-light fa-message-captions ice'
  //   },
  //   {
  //     Name: 'Human Interactions',
  //     DisplayName: 'Human Interactions',
  //     RouteName: '/bot/human-interactions/conversations',
  //     iconClass: 'fa-light fa-message-bot ice'
  //   },
  //   {
  //     Name: 'Console',
  //     DisplayName: 'Console',
  //     RouteName: '/bot/console/event-logs',
  //     iconClass: 'fal fa-cog ice'
  //   }
  // ];
  menus: any = [];

  ConsoleRouteName = '/bot/console/bot-management/conversational-bot';
  // activeConsole = false;
  activeIndex = 0;
  isActive = false;
  analyticsSubMenus: any;
  consoleSubMenus: any;
  constructor(private sidenavService: SidenavService, private router: Router,private _authS: AuthService,) {
    this.router.events.subscribe(
      (event: any) => {
        if (event.urlAfterRedirects == '/bot/human-agent-takeover/bot-interaction') {
          this.activeIndex = this.menus.length - 1;
        }
        console.log(event)
      }
    );
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || "";
    this.initial = localStorage.getItem('initial') || "";
    this.email=localStorage.getItem('originalUserName')||"";
    this.getMenus();
    const urlSegments = this.router.url.split('/');
    let moduleSegment = urlSegments[2];
    let moduleSegment2 = urlSegments.slice(-2).join('/')
    this.activeIndex = this.menus.findIndex((item: any) => item.link === moduleSegment);
    if (this.activeIndex == -1) {
      this.activeIndex = this.menus.findIndex((item: any) => item.link === moduleSegment2);
    }
    // if(this.activeIndex == -1) this.activeConsole = true;
    // else this.activeConsole = false;
  }
  pushHumanAgentTransferModule() {
    this.menus.push({
      "mainId": 710,
      "type": null,
      "name": "Human Agent Takeover",
      "norm": null,
      "slug": "human_agent_takeover",
      "link": "human-agent-takeover/bot-interaction",
      "emerging": null,
      "parentId": 4,
      "baseId": 4,
      "typeId": null,
      "isSelected": false,
      "countUser": null,
      "isDisabled": false,
      "icon": "far fa-user-headset ice",
      "indexNo": 0,
      "subMenu": null,
      "permission": null,
      "id": 0
    })
  }
  getFilteredIconClasses(iconClass: string): string[] {
    const classes = iconClass.split(' ');
    return classes.map(cls => cls === 'fa-light' ? 'fa' : cls).filter(cls => cls !== 'ice');
  }

  // getMenus() {
  //   let menus = JSON.parse(localStorage.getItem('Menus') || '');
  //   this.menus = menus.filter((item: any) => item.ParentId === null);
  // }
  activeMenu(index: any, name: any) {
    this.activeIndex = index;
    this.isActive = true;

    this.sidenavService.updateMessage(name);

    // if(name == 'Console'){
    //   this.activeConsole = true;
    // }
    // else this.activeConsole = false;
    localStorage.setItem('analyticActiveParentIndex', '0');
    localStorage.setItem('consoleActiveParentIndex', '0');
  }


  getMenus() {
    if (!localStorage.getItem("BotMenuPreviews")) {
      this.sidenavService.getMenus()?.subscribe(
        (res: any) => {
          if (res) {
            this.menus = res;
            this.pushHumanAgentTransferModule()
            this.analyticsSubMenus = this.menus.find((menu: any) => menu.name == "Analytics")
            this.consoleSubMenus = this.menus.find((menu: any) => menu.name == "Console")
            localStorage.setItem("BotMenuPreviews", JSON.stringify(res))
            localStorage.setItem("analyticsSubMenus", JSON.stringify(this.analyticsSubMenus?.subMenu))
            localStorage.setItem("consoleSubMenus", JSON.stringify(this.consoleSubMenus?.subMenu))
            //this.menus = this.menus.filter((item: any) => item.ParentId === null);
          }
        }, (error: any) => {
          console.error("Internal Server Error", error);
          const toasterObject = { isShown: true, isSuccess: false, toastHeading: "Failed", toastParagrahp: "Internal Server Error!" }
        });
    }
    else {
      this.menus = JSON.parse(localStorage.getItem("BotMenuPreviews") || '[]')
      this.analyticsSubMenus = this.menus.find((menu: any) => menu.name == "Analytics")
      this.consoleSubMenus = this.menus.find((menu: any) => menu.name == "Console")
    }

  }
  changeColors(color: any) {
    changeTheme(color)
  }
  signOut() {
    this._authS.doLogout();
  }
}
