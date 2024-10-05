import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BotMonitoringService } from '../../../../live-bot-interactions/bot-monitoring.service';
import { ChatHistoryVisibilityServiceService } from '../../../../../core/services/chat-history-visibility-service.service';
// import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { environment } from '../../../../../../environments/environment';
import { InitialsService } from '../../../../../core/services/initials.service';
import { bot_id, workspace_id, chat_path, bot_name } from '../../../../../../main';
import { MarkdownModule } from 'ngx-markdown';
@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
  standalone: true,
  imports: [CommonModule,MarkdownModule],
  providers: [DatePipe]
})
export class ChatHistoryComponent implements OnInit {

  @Input() chat: any = { history: [], tags: [] };
  isMinimized: boolean = true;
  isRemoved: boolean = false;
  @Output() minimizeToggle: EventEmitter<void> = new EventEmitter<void>();
  interval: any;
  bot_name = bot_name
  bot_id= bot_id;
  workspace_id= workspace_id;
  currentUserName: any = '';

  constructor(public InitialsService:InitialsService, private chatVisibilityService: ChatHistoryVisibilityServiceService, private _botS: BotMonitoringService,private _spinner:NgxSpinnerService,private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.currentUserName = this.chat.username!=null ? this.chat.username : '';
    // this.interval = setInterval(() => {
      this.refreshHistory();
    // }, 5000)
    this.chat.map((item:any) => {
      item.timestamp = this.formatDate(item.timestamp);
    })
    console.log("this.chat", this.chat)
  }
  removeScreen() {
    let newChat =
      { "session_id": this.chat.session_id }
    this.chatVisibilityService.notifyNewChatIdHistory(newChat);
    const index = this.chatVisibilityService.refreshHistoryArray.indexOf(this.chat.session_id);
    if (index !== -1) {
      this.chatVisibilityService.refreshHistoryArray.splice(index, 0);
}

  }
  toggleMinimized(): void {
    this.isMinimized = !this.isMinimized;
  }
  refreshHistory() {
    const formData = {bot_id:this.bot_id,workspace_id:this.workspace_id,session_id:this.chat.session_id}
    this._botS.ChatHistory(formData).subscribe((res: any) => {
      if (res.detail.length > 0) {
        res.detail['session_id'] = this.chat.session_id;
        res.detail['last_message'] = this.chat.last_message;
        res.detail.map((item:any) => {
          item.timestamp = this.formatDate(item.timestamp);
        })
        this.currentUserName = res.username;
        this.chat = res.detail;
        //this.chats.push(res[0].history);
      } else {
        this._spinner.hide('chat-history')
        alert("History not found");
      }
    }, (error) => {
      console.error(error);
    });
  }

  formatDate(inputDate: string): any {
    const [day, month, year, hours, minutes, seconds] = inputDate.split(/[/ :]/);
    const parsedDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return this.datePipe.transform(parsedDate, 'h:mm a');
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }
  // refreshHistory() {
  //   
  //   this._botS.ChatHistory({ 'slug': this.chat[0].slug }).subscribe((res: any) => {
  //     if (res[0].history.length > 0) {
  //       res[0].history[0]['slug'] = this.chat[0].slug;
  //       res[0].history[0]['name'] = this.chat[0].name;
  //       this.chat = res[0].history;
  //       //this.chats.push(res[0].history);
  //     } else {
  //       this._spinner.hide('chat-history')
  //       alert("History not found");
  //     }
  //   }, (error) => {
  //     console.error(error);
  //   });
  // }
}

