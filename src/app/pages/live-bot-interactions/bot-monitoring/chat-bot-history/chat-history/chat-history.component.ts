import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ChatVisibilityService } from '../../../../../core/services/chat-visibility.service';
// import { SharedModuleModule } from 'src/app/shared-module/shared-module.module';
import { BotMonitoringService } from '../../../bot-monitoring.service';
import { environment } from '../../../../../../environments/environment';
import { CustomDatePipe } from '../../../../../shared/pipes/custom-date.pipe';
import { InitialsService } from '../../../../../core/services/initials.service';
import { ChatVisibilityTakeoverService } from '../../../../../core/services/chat-visibility-takeover.service';
import { Router } from '@angular/router';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { bot_id, workspace_id, chat_path, bot_name } from '../../../../../../main';
import { MarkdownModule, MarkdownService, provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, MarkdownModule],
  providers: [DatePipe, provideMarkdown()]
})
export class ChatHistoryComponent implements OnInit {

  @Input() chat: any = { history: [], tags: [] };
  isMinimized: boolean = true;
  isRemoved: boolean = false;
  @Output() minimizeToggle: EventEmitter<void> = new EventEmitter<void>();
  interval: any;
  bot_name = bot_name
  bot_id = bot_id;
  workspace_id = workspace_id;
  currentUserName: any = '';

  constructor(private spinner: NgxSpinnerService,private _botService: BotMonitoringService,private sidenavService: SidenavService,private router: Router,private agentTakeService: ChatVisibilityTakeoverService ,public InitialsService:InitialsService,private chatVisibilityService: ChatVisibilityService, private _botS: BotMonitoringService, private _spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.currentUserName = this.chat.username!=null ? this.chat.username : '';
    this.interval = setInterval(() => {
      this.refreshHistory();
    }, 5000)
    this.chat.map((item: any) => {
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
  redirectToAgentTakeover(){
    const body = {
      "text": '/takeover',
      "session_id": this.chat.session_id,
      "workspace_id": this.workspace_id,
      "bot_id": this.bot_id,
      "token": localStorage.getItem("token"),
      "agent_name": localStorage.getItem("username")
    };
    this._botService.ChatHumanWdidget(body).subscribe((res:any)=>{
      this.agentTakeService.notifyNewChatIdHistory(this.chat);
      this.sidenavService.updateMessage('Human Agent Takeover');
      this.router.navigate(['/bot/human-agent-takeover/bot-interaction']);
    },
    (error: any) => {
      const now = Date.now();
    })
  }
  toggleMinimized(): void {
    this.isMinimized = !this.isMinimized;
  }
  refreshHistory() {
    const formData = { bot_id: this.bot_id, workspace_id: this.workspace_id, session_id: this.chat.session_id }
    this._botS.ChatHistory(formData).subscribe((res: any) => {
      if (res.detail.length > 0) {
        res.detail['session_id'] = this.chat.session_id;
        res.detail['last_message'] = this.chat.last_message;
        res.detail.map((item: any) => {
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

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

