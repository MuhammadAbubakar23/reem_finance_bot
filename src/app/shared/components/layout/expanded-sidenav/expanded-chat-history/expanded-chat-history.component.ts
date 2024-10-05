import { Component } from '@angular/core';

import { CommonModule, Location } from "@angular/common";

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { bot_id, workspace_id } from '../../../../../../main';
import { ChatHistoryVisibilityServiceService } from '../../../../../core/services/chat-history-visibility-service.service';
import { BotMonitoringService } from '../../../../../core/services/bot-monitoring.service';
import { HeaderService } from '../../../../../core/services/header.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { SharedService } from '../../../../../core/services/shared.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared.module';
import { InitialsService } from '../../../../../core/services/initials.service';
declare var toggleNavPanel: any;
@Component({
  selector: 'app-expanded-chat-history',
  standalone: true,
  imports: [CommonModule,RouterModule,NgxSpinnerModule,SharedModule,FormsModule],
  templateUrl: './expanded-chat-history.component.html',
  styleUrls: ['./expanded-chat-history.component.scss']
})
export class ExpandedChatHistoryComponent {

  activeIndex = 0;
  isActive = false;
  searchText: any = '';

  activechatBotHistory: any = [];
  defaultchatBotHistory: any = [];
  completedConversation: any[] = [];
  showBotMonitoringContent: boolean = false;
  interval: any;
  workspace_id = workspace_id;
  bot_id = bot_id;
  constructor(private chatVisibilityService: ChatHistoryVisibilityServiceService,
    private headerService: HeaderService, private _botService: BotMonitoringService,
    private _route: Router, private _sharedS: SharedService,public InitialsService:InitialsService
    , private _spinner: NgxSpinnerService, private sidenavService: SidenavService, private location: Location) {
    console.log("Bot History Menu ")
  }

  ngOnInit(): void {
    // this.chatVisibilityServicee.refreshHistoryArray = [];

    this.getChatBotHistory();
    this.chatVisibilityService.thirdActiveHistory$.subscribe((obj: any) => {
      if (obj) {
        const index = this.activechatBotHistory.findIndex((item: any) => item.session_id === obj.session_id)
        if (index != -1) {
          this.activechatBotHistory[index]['active'] = obj.active;
        }
      }

    })

    this.interval = setInterval(() => {
      this.getChatBotHistoryonRefresh();
    }, 15000)
  }

  filterResults() {
    if (!this.searchText) {
      this.activechatBotHistory = this.defaultchatBotHistory.slice();
      return;
    }
    this.activechatBotHistory = this.defaultchatBotHistory.filter((item: any) => item?.session_id.toLowerCase().includes(this.searchText.toLowerCase()) || item?.last_message.toLowerCase().includes(this.searchText.toLowerCase()) || item?.username?.toLowerCase().includes(this.searchText.toLowerCase()));
  }
  toggleChatVisibility(clickedItem: any) {
    this.chatVisibilityService.notifyNewChatIdHistory(clickedItem);
  }

  goBack() {
    this._sharedS.setShowGenerativeMenu('');
  }
  getChatBotHistory() {
    this._spinner.show('chat-history-menu');
    const formData = { bot_id: this.bot_id, workspace_id: this.workspace_id }
    this._botService.chatBotHistoryForChatHistoryModule(formData).subscribe((res: any) => {
      // res.slugs = this.transformLogsResponse(res);
      // res.slugs.forEach((item: any, index: any) => {
      //   item.name = "Unknown" + `${index + 1}`
      //   item['active'] = false;
      // })
      // if(res.slugs.length>0){
      //    this._spinner.hide('chat-history-menu');
      //   this.activechatBotHistory = res.slugs;
      // }
      if (res.detail.length > 0) {
        this._spinner.hide('chat-history-menu');

        const sentiments = ['Positive', 'Negative'];
        res.detail.forEach((item: any, index: any) => {
          item['active'] = false;
          if (index != 0 || index != 1) {
            item['sentiment'] = sentiments[Math.floor(Math.random() * sentiments.length)];
          }
          else {
            item['sentiment'] = "Negative"
          }
        })
        this.defaultchatBotHistory = res.detail;
        this.activechatBotHistory = this.defaultchatBotHistory.slice();
      }
    },
      (error: any) => {
        this._spinner.hide('chat-history-menu');
        //alert('Service unavailable');
      })
  }

  transformLogsResponse(response: any) {
    return Object.keys(response.all_logs).map(slug => ({
      slug: slug,
      historyApiresponse: [{ history: response.all_logs[slug] }]
      // history: response.all_logs[slug]
    }));
  }

  getChatBotHistoryonRefresh() {
    const formData = {bot_id:this.bot_id,workspace_id:this.workspace_id}
    this._botService.chatBotHistoryForChatHistoryModule(formData).subscribe((res: any) => {
      const sentiments = ['Positive', 'Negative'];
      if(res.detail.length>0){
       res.detail.forEach((item: any, index: any) => {
        if(index != 0 || index != 1){
          item['sentiment'] = sentiments[Math.floor(Math.random() * sentiments.length)];
        }
        else{
          item['sentiment'] = "Negative"
        }
      })
       this.defaultchatBotHistory = res.detail;
      this.activechatBotHistory =this.defaultchatBotHistory.slice();
     }
     this.chatVisibilityService.refreshHistoryArray.forEach((session_id)=>{
      this.activechatBotHistory.forEach((item:any)=>{
        if(item.session_id == session_id){
          item.active = true;
        }
      })
    })
  },
  (error: any) => {
  })
}

  toggle() {
    ;
  }

  toggleNavTest() {
    toggleNavPanel();
  }

  ngOnDestroy() {
    this.chatVisibilityService.refreshHistoryArray = []
    clearInterval(this.interval);
  }
}


// i want to have this format:
// [
//   {
//     slug: "05b429d4-ad2b-4734-98b1-57add915f902",
//     historyApiresponse:[
//       {
//         history: [
//           {
//               "chatId": 330,
//               "content": "hi",
//               "role": "user",
//               "sentAt": 1721664654
//           },
//           {
//               "chatId": 330,
//               "content": "Hello! Would you like to converse in English or Arabic?",
//               "feedbackScore": null,
//               "role": "assistant",
//               "sentAt": 1721664654,
//               "sources": [],
//               "type": "chat"
//           },
//           {
//               "chatId": 331,
//               "content": "hi",
//               "role": "user",
//               "sentAt": 1721664660
//           },
//           {
//               "chatId": 331,
//               "content": "I didn't quite catch that. Would you like to converse in English or Arabic?",
//               "feedbackScore": null,
//               "role": "assistant",
//               "sentAt": 1721664660,
//               "sources": [],
//               "type": "chat"
//           },
//           {
//               "chatId": 332,
//               "content": "hi",
//               "role": "user",
//               "sentAt": 1721664667
//           },
//           {
//               "chatId": 332,
//               "content": "Let's start fresh. I'd like to know, would you like to converse in English or Arabic?",
//               "feedbackScore": null,
//               "role": "assistant",
//               "sentAt": 1721664667,
//               "sources": [],
//               "type": "chat"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     slug:  "072f2f89-18ac-4266-ba3a-7079eac43ca3",
//     historyApiresponse:[
//       {
//         history: [
//           {
//               "chatId": 344,
//               "content": "Hi",
//               "role": "user",
//               "sentAt": 1721726190
//           },
//           {
//               "chatId": 344,
//               "content": "Hello! Would you like to converse in English or Arabic?",
//               "feedbackScore": null,
//               "role": "assistant",
//               "sentAt": 1721726190,
//               "sources": [],
//               "type": "chat"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     slug:  "131fa692-67b0-4fda-a42a-220cbef1c280",
//     historyApiresponse:[
//       {
//         history: [
//           {
//               "chatId": 341,
//               "content": "Hi",
//               "role": "user",
//               "sentAt": 1721726029
//           },
//           {
//               "chatId": 341,
//               "content": "Hello! Would you like to converse in English or Arabic?",
//               "feedbackScore": null,
//               "role": "assistant",
//               "sentAt": 1721726029,
//               "sources": [],
//               "type": "chat"
//           }
//         ]
//       }
//     ]
//   }
// ]
