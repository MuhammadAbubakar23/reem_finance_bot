import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { ChatBotHistoryComponent } from './chat-bot-history/chat-bot-history.component';

@Component({
  selector: 'app-bot-monitoring',
  templateUrl: './bot-monitoring.component.html',
  styleUrls: ['./bot-monitoring.component.scss'],
  standalone: true,
  imports: [ChatBotHistoryComponent]
})
export class BotMonitoringComponent implements OnInit{
  constructor(private _hS: HeaderService, private sidenavService: SidenavService) {
    _hS.updateHeaderData({
      title: 'Bot Interactions',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-message-bot"
    })
  }
  ngOnInit(): void {
  }
}
