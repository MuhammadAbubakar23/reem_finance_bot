import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { ChatBotHistoryComponent } from './chat-bot-history/chat-bot-history.component';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,ChatBotHistoryComponent],
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit{
  constructor(private _hS: HeaderService, private sidenavService: SidenavService) {
    _hS.updateHeaderData({
      title: 'Chat History',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-message-bot"
    })
  }
  ngOnInit(): void {
  }
}
