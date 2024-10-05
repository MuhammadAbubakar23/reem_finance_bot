import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ChatVisibilityService } from 'src/app/services/chat-visibility.service';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../../../shared/shared.module';
import { bot_id, bot_name, workspace_id } from '../../../../../../main';
import { BotMonitoringService } from '../../../../../core/services/bot-monitoring.service';
import { ChatVisibilityTakeoverService } from '../../../../../core/services/chat-visibility-takeover.service';
import { InitialsService } from '../../../../../core/services/initials.service';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, MarkdownModule],
  providers: [DatePipe, MarkdownModule, provideMarkdown()]
})
export class ChatHistoryComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @Input() chat: any = { history: [], tags: [] };
  @Output() onSuggestion = new EventEmitter<any>();
  isMinimized: boolean = true;
  isRemoved: boolean = false;
  @Output() minimizeToggle: EventEmitter<void> = new EventEmitter<void>();
  interval: any;
  bot_name = bot_name
  bot_id = bot_id;
  workspace_id = workspace_id;
  currentUserName: any = '';
  chatForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required])
  })
  lastServiceErrorTime: number = 0;
  tempCount: any;
  messages: any[] = [];
  typing = false;
  summary: any;
  languages: any = ["English", "Urdu", "Spanish", "Arabic"];
  language: any;
  tones: any = ["Casual", "Formal", "Friendly", "Shorter", "Longer"];
  tone: any;
  constructor(public InitialsService:InitialsService, private _botService: BotMonitoringService, private _toastS: ToastrService, private chatVisibilityService: ChatVisibilityTakeoverService, private _botS: BotMonitoringService, private _spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.getSummary();
    this.currentUserName = this.chat.username != null ? this.chat.username : '';
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
  toggleMinimized(): void {
    this.isMinimized = !this.isMinimized;
  }
  refreshHistory() {
    const formData = { bot_id: this.bot_id, workspace_id: this.workspace_id, session_id: this.chat.session_id }
    this._botS.ChatHistory(formData).subscribe((res: any) => {
      if (this.tempCount > 0) {
        this.tempCount--;
        this.chat.splice(this.chat.length - 1, 1)
      }
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
  getSummary() {
    const body = {
      token: localStorage.getItem("token"),
      session_id: this.chat.session_id
    }
    this._spinner.show('agent-takeover')
    this._botService.Summary(body).subscribe((res: any) => {
      //summary suggestions
      this.summary = res;
      this.pickSuggestion(res.suggestions)
    },
      (error: any) => {
        this._spinner.hide('agent-takeover');
      }
    )
  }
  public pickSuggestion(suggestion: any): void {
    this.onSuggestion.emit(suggestion);
  }
  submitMessage(msg: any) {
    const mesage = msg;
    const message = this.chatForm.value['message'];

    if (!message.trim()) {
      const now = Date.now();
      if (now - this.lastServiceErrorTime > 3000) {
        this._toastS.error('Message is Required', '', {
          timeOut: 3000,
        });
        this.lastServiceErrorTime = now;
      }
    }
    else {
      if (!this.chat.session_id) {
        this._botService.chatInit().subscribe(
          (res: any) => {
            this.chat.session_id = res.session_id;
            this.sendMessage(mesage);
          },
          (error: any) => {
            const now = Date.now();
            if (now - this.lastServiceErrorTime > 3000) {
              this._toastS.error('Service Unavailable', 'Failed!', {
                timeOut: 3000,
              });
              this.lastServiceErrorTime = now;
            }
          }
        );
      } else {
        this.sendMessage(mesage);
      }
    }

  }
  sendMessage(mesage: any) {
    const body = {
      "text": mesage != '' ? mesage : this.chatForm.value['message'],
      "session_id": this.chat.session_id,
      "workspace_id": this.workspace_id,
      "bot_id": this.bot_id,
      // "token": "7dIxWgeDrvMY3cFAS3UsZuZCoZWto4lzcurzJn0QL7Myw7KHe7LdWlOnEtAeSoe1"
      "token": localStorage.getItem("token"),
      "agent_name": localStorage.getItem("username")
    };
    var date = this.getCurrentTime();

    this.tempCount++;
    this.chat.push({
      text: this.chatForm.value['message'],
      timestamp: date,
      type: 'human-agent',
      agent_name: localStorage.getItem("username")
    })
    // this.scrollToBottom()
    // this.messages.push({
    //   message: this.chatForm.value['message'],
    //   slug: this.chat.session_id,
    //   type: 'human_agent',
    //   timestamp: new Date()
    // });

    this.chatForm.reset({ message: '' });
    this.typing = true;
    // this.currentTimestamp = new Date();

    this._botService.ChatHumanWdidget(body).subscribe(
      (res: any) => {
        this.typing = false;
        // this.messages.push({
        //   message: res.detail,
        //   type: 'user',
        //   timestamp: new Date()
        // });
      },
      (error: any) => {
        const now = Date.now();
        this.typing = false;
        this.messages.splice(this.messages.length - 1, 1)
        if (now - this.lastServiceErrorTime > 3000) {
          this._toastS.error('Service Unavailable', 'Failed!', {
            timeOut: 3000,
          });
          this.lastServiceErrorTime = now;
        }
      }
    );
  }
  killChat(kill: any) {
    const confirmation = confirm('Are you sure you want to end this conversation?');
    if (confirmation) {
      this.submitMessage(kill);
      this.removeScreen();
    }
    else {
      this.chatForm.reset({ message: '' });
    }
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents adding a new line
      this.submitMessage('');
    }
  }
  getCurrentTime(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutesStr} ${ampm}`;
  }
  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    const maxScrollTop = scrollHeight - clientHeight;
    const targetPosition = maxScrollTop * 0.99;

    if (scrollTop > targetPosition) {
      event.target.scrollTop = targetPosition;
    }
  }

  scrollToBottom() {
    const scrollHeight = this.myScrollContainer.nativeElement.scrollHeight;
    const clientHeight = this.myScrollContainer.nativeElement.clientHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    console.log("test", maxScrollTop)
    const targetPosition = maxScrollTop * 1.1;
    console.log("test", targetPosition)

    this.myScrollContainer.nativeElement.scrollTop = targetPosition;
    console.log("test", this.myScrollContainer.nativeElement.scrollTop)
  }
  correctGrammar() {
    if (this.chatForm.value['message']) {
      const body = {
        text: this.chatForm.value['message'],
        slug: "1c7d6da6-f79b-410c-a6db-6944e4a43f9c"
      };
      this._botS.GrammerChange(body).subscribe((res: any) => {
        this.chatForm.get('message')?.setValue(res.result);
      })
    }
  }

  translateText(selectedLanguage: string) {
    if (selectedLanguage) {
      const body = {
        text: this.chatForm.value['message'],
        language: selectedLanguage,
        slug: "1c7d6da6-f79b-410c-a6db-6944e4a43f9c"
      };
      this._botS.LanguageChange(body).subscribe((res: any) => {
        this.chatForm.get('message')?.setValue(res.result);

        // Handle the response as needed
      });
    }
  }

  changeTone(tone: any) {
    if (tone) {
      const body = {
        text: this.chatForm.value['message'],
        tone: tone,
        slug: "1c7d6da6-f79b-410c-a6db-6944e4a43f9c"
      };
      this._botS.ToneChange(body).subscribe((res: any) => {

        this.chatForm.get('message')?.setValue(res.result);
      })
    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

