import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { ChatBotHistoryComponent } from './chat-bot-history/chat-bot-history.component';


@Component({
  selector: 'app-bot-monitoring',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule,ChatBotHistoryComponent],
  templateUrl: './bot-monitoring.component.html',
  styleUrls: ['./bot-monitoring.component.scss']
})
export class BotMonitoringComponent implements OnInit{
  constructor(private _hS: HeaderService, private sidenavService: SidenavService) {
    _hS.updateHeaderData({
      title: 'Human Agent Takeover',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "far fa-user-headset"
    })
  }
  ngOnInit(): void {
  }
}
