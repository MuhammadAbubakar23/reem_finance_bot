import { Component, OnInit } from '@angular/core';

import { debounceTime, exhaustMap } from 'rxjs/operators';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

// import { BotMonitoringService } from '../../../bot-monitoring.service';

import { Subscription } from 'rxjs';
import { ChatHistoryComponent } from '../chat-bot-history/chat-history/chat-history.component';
import { SharedModule } from '../../../../shared/shared.module';
import { bot_id, workspace_id } from '../../../../../main';
import { ChatHistoryVisibilityServiceService } from '../../../../core/services/chat-history-visibility-service.service';
import { BotMonitoringService } from '../../../../core/services/bot-monitoring.service';
import { SharedService } from '../../../../core/services/shared.service';

@Component({
  selector: 'app-chat-bott-history',
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

  private newChatIdHistorySubscription: Subscription | undefined;
  bot_id= bot_id;
  workspace_id= workspace_id;

  constructor(
    private _chatVisibilityS: ChatHistoryVisibilityServiceService,
    private _botS: BotMonitoringService,
    private _spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this.sharedService.showChatWidget$.subscribe((value)=>{
      if(value!=null && value !== undefined){
        this.showWidget=value;
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

  getChatDetails(activeChat: any) {

    const data = { session_id: activeChat.session_id, last_message: activeChat.last_message };
    if (this.chats.length > 2) {
      this._chatVisibilityS.notifythirdActiveHistory({ active: false, session_id: activeChat.session_id });
      alert('The maximum number of visible screens is limited to three.');
      return [];
    }
    return this.getHistoryDetails(data);
  }


  getHistoryDetails(data: any) {
    this._spinner.show('chat-history1');
    const formData = {bot_id:this.bot_id,workspace_id:this.workspace_id,session_id:data.session_id}

    return this._botS.ChatHistory(formData).pipe(
      exhaustMap((res: any) => {
        this._spinner.hide('chat-history1');
        if (res.detail.length > 0) {
          this._chatVisibilityS.notifythirdActiveHistory({active:true, session_id: data.session_id });
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
  //
  //   this._spinner.show('chat-history');
  //   return this._botS.ChatHistory({ 'slug': data.slug }).pipe(
  //     exhaustMap((res: any) => {
  //       this._spinner.hide('chat-history');
  //       if (res[0].history.length > 0) {
  //         this._chatVisibilityS.notifythirdActiveHistory({ active: true, slug: data.slug });
  //         res[0].history[0]['slug'] = data.slug;
  //         res[0].history[0]['name'] = data.name;
  //         this.chats.push(res[0].history);
  //         this._chatVisibilityS.refreshMethod(res[0].history[0].slug);
  //       } else {
  //         alert("History not found");
  //       }
  //       return [];
  //     })
  //   );
  // }
  onMinimizeToggle(minimizeItem: any) {
    console.log("minimize toggle", minimizeItem, this.chats);
  }
  ngOnDestroy() {
    this.sharedService.setShowChatWidget(false);
    this._chatVisibilityS.notifyNewChatIdHistory(null);
    if (this.newChatIdHistorySubscription) {
      this.newChatIdHistorySubscription.unsubscribe();
    }
  }
}
