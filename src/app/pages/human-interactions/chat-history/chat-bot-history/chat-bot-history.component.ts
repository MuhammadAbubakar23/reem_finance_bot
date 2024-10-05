import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { ChatHistoryComponent } from './chat-history/chat-history.component';

import { debounceTime, exhaustMap, Subscription } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { bot_id, workspace_id } from '../../../../../main';
import { ChatVisibiltyHumanInteractionService } from '../../../../core/services/chat-visibilty-human-interaction.service';
import { BotMonitoringService } from '../../../../core/services/bot-monitoring.service';
import { SharedService } from '../../../../core/services/shared.service';


@Component({
  selector: 'app-chat-bot-history',
  templateUrl: './chat-bot-history.component.html',
  styleUrls: ['./chat-bot-history.component.scss'],
  standalone: true,
  imports: [CommonModule, ChatHistoryComponent, SharedModule, NgxSpinnerModule]
})
export class ChatBotHistoryComponent implements OnInit {
  chats: any[] = [];
  currentActiveChats: any[] = [];
  hasParent: boolean = true;
  showWidget: boolean = false;
  activeIntervalId: any
  private newChatIdHistorySubscription: Subscription | undefined;
  bot_id = bot_id;
  workspace_id = workspace_id;

  constructor(
    private _chatVisibilityS: ChatVisibiltyHumanInteractionService,
    private _botS: BotMonitoringService,
    private _spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.checkActiveItems();
    this.sharedService.showChatWidget$.subscribe((value) => {
      if (value != null && value !== undefined) {
        this.showWidget = value;
      }
    })
    this.newChatIdHistorySubscription = this._chatVisibilityS.newChatIdHistory$
      .pipe(
        debounceTime(100),
        exhaustMap((newChat: any) => {

          if (newChat) {
            const chatIndex = this.chats.findIndex(chat => chat.session_id === newChat.session_id);
            if (chatIndex !== -1) {
              this.chats.splice(chatIndex, 1);
              this._chatVisibilityS.notifythirdActiveHistory({ active: false, session_id: newChat.session_id });
              const refreshIndex = this._chatVisibilityS.refreshHistoryArray.findIndex(session_id => session_id == newChat.session_id);
              this._chatVisibilityS.refreshHistoryArray.splice(refreshIndex, 1);
              return [];
            } else {
              return this.getChatDetails(newChat);
            }
          }
          return [];
        })
      )
      .subscribe();
  }
  checkActiveItems() {
    this.activeIntervalId = setInterval(() => {

      const activeChatsString = localStorage.getItem('activeChatsHumanInteractions');
      if (activeChatsString) {
        const activeChats = JSON.parse(activeChatsString);
        this.chats = this.chats.filter(chat =>
          activeChats.some((activeChat: any) => activeChat.session_id === chat.session_id)
        );
      } else {
        this.chats = [];
      }
    }, 2000);
  }

  getChatDetails(activeChat: any) {

    const data = { session_id: activeChat.session_id, last_message: activeChat.last_message };
    if (this.chats.length > 2) {
      this._chatVisibilityS.notifythirdActiveHistory({ active: false, session_id: activeChat.session_id });
      alert('The maximum number of visible screens is limited to three.');
      return [];
    }
    return this.getHistoryDetails(data);
  }



  // getChatDetails(activeChat: any) {
  //   {
  //     const data = { active: activeChat.active, slug: activeChat.slug, name: activeChat.name }
  //     if (this.chats.length > 0) {
  //       if (this.chats.length == 2) {
  //         this.getHistoryDetails(data);
  //       }
  //       else if (this.chats.length < 3) {
  //         this.getHistoryDetails(data);
  //       } else {
  //         this._chatVisibilityS.notifythirdActiveHistory({ active: false, slug: activeChat.slug });
  //         alert('The maximum number of visible screens is limited to three.');

  //       }
  //     } else {
  //       this.getHistoryDetails(data);
  //     }
  //   }
  // }


  getHistoryDetails(data: any) {
    this._spinner.show('chat-history1');
    const formData = { bot_id: this.bot_id, workspace_id: this.workspace_id, session_id: data.session_id }

    return this._botS.ChatHistory(formData).pipe(
      exhaustMap((res: any) => {
        this._spinner.hide('chat-history1');
        if (res.detail.length > 0) {
          this._chatVisibilityS.notifythirdActiveHistory({ active: true, session_id: data.session_id });
          res.detail['session_id'] = data.session_id;
          res.detail['last_message'] = data.last_message;
          res.detail['username'] = res.username;
          this.chats.push(res.detail);
          this._chatVisibilityS.refreshMethod(data.session_id);
        } else {
          alert("History not found");
        }
        return [];
      })
    );
  }
  // getHistoryDetails(data: any) {

  //   this._chatVisibilityS.notifythirdActiveHistory({ active: data.active, slug: data.slug });
  //   this._botS.ChatHistory({ 'slug': data.slug }).subscribe((res: any) => {

  //     console.log(res);
  //     if (res[0].history.length > 0) {
  //       res[0].history[0]['slug'] = data.slug;
  //       this.chats.push(res[0].history);
  //     }
  //     else {
  //       alert("History not found")
  //     }
  //     // console.log(activeChat['completed'])
  //     // res[0]['completed'] = activeChat['completed'];
  //     // this.chats.push(res);
  //     // const latObject = {
  //     //   clientIdentifier: res[0].client?.phone,
  //     //   customerIdentifier: res[0].customer.phone,
  //     //   filter: {
  //     //     pageNumber: 0,
  //     //     pageSize: 0,
  //     //   },
  //     // };
  //     //this.currentActiveChats.push(latObject);
  //   });
  // }
  onMinimizeToggle(minimizeItem: any) {
    console.log("minimize toggle", minimizeItem, this.chats);
  }

  ngOnDestroy() {
    if (this.activeIntervalId) {
      clearInterval(this.activeIntervalId);
    }
    this.sharedService.setShowChatWidget(false);
    this._chatVisibilityS.notifyNewChatIdHistory(null);
    if (this.newChatIdHistorySubscription) {
      this.newChatIdHistorySubscription.unsubscribe();
    }
  }
}
