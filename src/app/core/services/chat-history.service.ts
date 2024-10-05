import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  chatBotBaseUrl = environment.chatBotBaseUrl
  constructor(private http: HttpClient) { }
  ChatWdidget(form: any) {
    return this.http.post(this.chatBotBaseUrl + "/chat", form);
  }
  chatInit() {
    return this.http.get(this.chatBotBaseUrl + "/init");
  }
  chatBotHistory() {
    return this.http.get(this.chatBotBaseUrl + "/slugs");
  }
  ChatBotWdidget(form: any) {
    return this.http.post(this.chatBotBaseUrl + "/chatbot", form).pipe(timeout(120 * 1000));
  }
  ChatHistory(form: any) {
    return this.http.post(this.chatBotBaseUrl + "history", form);
  }
}
