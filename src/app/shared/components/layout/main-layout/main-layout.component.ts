import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidenavComponent } from "../sidenav/sidenav.component";

import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { ConversationlBotService } from '../../../../core/services/conversationl-bot.service';
import { workspace_id } from '../../../../../main';
import { ExpandedAnalyticsComponent } from '../expanded-sidenav/expanded-analytics/expanded-analytics.component';
import { ExpandedBotConversationComponent } from '../expanded-sidenav/expanded-bot-conversation/expanded-bot-conversation.component';
import { ExpandedChatHistoryComponent } from '../expanded-sidenav/expanded-chat-history/expanded-chat-history.component';
import { ExpandedConsoleComponent } from '../expanded-sidenav/expanded-console/expanded-console.component';
import { ExpandedHumanAgentTakeoverComponent } from '../expanded-sidenav/expanded-human-agent-takeover/expanded-human-agent-takeover.component';
import { ExpandedHumanInteractionsComponent } from '../expanded-sidenav/expanded-human-interactions/expanded-human-interactions.component';



@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidenavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  public subscription!: Subscription;

  @ViewChild('container', { read: ViewContainerRef }) target: ViewContainerRef | undefined;
  componentName: string = 'Analytics';

  constructor(
    private resolver: ComponentFactoryResolver,
    private sidenavService: SidenavService,
    private router: Router,
    private _bS: ConversationlBotService
  ) {
    this.updateSidenav();
  }

  updateSidenav() {
    const urlSegments = this.router.url.split('/');
    let moduleSegment = urlSegments[2];
    console.log("Sidenav", moduleSegment)
    switch (moduleSegment) {
      case 'ai-bot':
        moduleSegment = 'Bot Interactions'
        break;
      case 'human-agent-takeover':
        moduleSegment = 'Human Agent Takeover'
        break;
      case 'chat-history':
        moduleSegment = 'Chat History'
        break;
      case 'human-interactions':
        moduleSegment = 'Human Interactions'
        break;
      case 'analytics':
        moduleSegment = 'Analytics'
        break;
      case 'console':
        moduleSegment = 'Console'
        break;
    }
    this.sidenavService.updateMessage(moduleSegment);
  }

  ngOnInit(): void {
    this.setToken();
    this.sidenavService.getMessage.subscribe((msg: string) => {
      this.componentName = msg;
      this.target?.clear();
      this.loadComponent(this.componentName);
    });
  }

  setToken() {
    this._bS.getToken(workspace_id).subscribe((res: any) => {
      localStorage.setItem("token", res.token);
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadComponent(this.componentName);
    })
  }

  loadComponent(leftSideName: string): void {
    let componentFactory = null;
    switch (leftSideName) {
      // case 'Bot Interactions':
      //   componentFactory = this.resolver.resolveComponentFactory(ExpandedAiBotComponent);
      //   this.target?.createComponent(componentFactory);
      //   break;
      case 'Analytics':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedAnalyticsComponent);
        this.target?.createComponent(componentFactory);
        break;
      case 'Console':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedConsoleComponent);
        this.target?.createComponent(componentFactory);
        break;
      case 'Bot Interactions':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedBotConversationComponent);
        this.target?.createComponent(componentFactory);
        break;
      case 'Human Agent Takeover':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedHumanAgentTakeoverComponent);
        this.target?.createComponent(componentFactory);
        break;
      case 'Live Bot Interactions':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedBotConversationComponent);
        this.target?.createComponent(componentFactory);
        break;
      case 'Human Interactions':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedHumanInteractionsComponent);
        this.target?.createComponent(componentFactory);
        break;
      case 'Chat History':
        componentFactory = this.resolver.resolveComponentFactory(ExpandedChatHistoryComponent);
        this.target?.createComponent(componentFactory);
        break;
      default:
        componentFactory = this.resolver.resolveComponentFactory(ExpandedAnalyticsComponent);
        this.target?.createComponent(componentFactory);
        break;

    }
    // if (componentFactory && this.target) {

    // }

  }
}


