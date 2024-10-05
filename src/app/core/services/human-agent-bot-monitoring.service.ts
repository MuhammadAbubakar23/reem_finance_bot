import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BotMonitoringService {
  chatBotBaseUrl = environment.chatBotBaseUrl
  composeUrl = environment.composeUrl
  changeGrammer = "grammar"
  changeTone = "change_tone"
  changeLanguage = "translate"
  constructor(private http: HttpClient) { }
  ChatWdidget(form: any) {
    return this.http.post(this.chatBotBaseUrl + "/chat", form);
  }
  chatInit() {
    return this.http.get(this.chatBotBaseUrl + "/init");
  }
  chatBotHistory(obj:any) {
    const formData = new FormData();
    formData.append('bot_id', obj.bot_id);
    formData.append('workspace_id', obj.workspace_id);
    return this.http.post(this.chatBotBaseUrl + "chats/active/get_all/bot",formData);
  }

  ChatBotWdidget(form: any) {
    const formData = new FormData();
    formData.append('bot_id', form.bot_id);
    formData.append('workspace_id', form.workspace_id);
    formData.append('text', form.text);
    formData.append('session_id', form.session_id);
    formData.append('token',form.token)
    return this.http.post(this.chatBotBaseUrl + "chats/batch", formData).pipe(timeout(120 * 1000));
  }

  ProfileCreate(form: any){
    const formData = new FormData();
    formData.append('token',form.token)
    formData.append('username',form.username)
    formData.append('email',form.email)
    return this.http.post(this.chatBotBaseUrl + "profiles/create", formData);
  }

  ChatHumanWdidget(form: any) {
    const formData = new FormData();
    formData.append('bot_id', form.bot_id);
    formData.append('workspace_id', form.workspace_id);
    formData.append('text', form.text);
    formData.append('session_id', form.session_id);
    formData.append('token',form.token)
    formData.append('agent_name',form.agent_name)
    return this.http.post(this.chatBotBaseUrl + "chats/human_agent", formData).pipe(timeout(120 * 1000));
  }
  ChatHistory(form: any) {
    const formData = new FormData();
    formData.append('bot_id', form.bot_id);
    formData.append('workspace_id', form.workspace_id);
    formData.append('session_id', form.session_id);
    return this.http.post(this.chatBotBaseUrl + "chats/get", formData);
  }

  chatBotHistoryForChatHistoryModule(obj:any) {
    const formData = new FormData();
    formData.append('bot_id', obj.bot_id);
    formData.append('workspace_id', obj.workspace_id);
    return this.http.post(this.chatBotBaseUrl + "chats/inactive/get_all",formData);
  }

  chatBotHistoryForHumanInteraction(obj:any) {
    const formData = new FormData();
    formData.append('bot_id', obj.bot_id);
    formData.append('workspace_id', obj.workspace_id);
    return this.http.post(this.chatBotBaseUrl + "chats/active/get_all/human", formData);
  }
  Summary(form:any){
    const formData = new FormData();
    formData.append('session_id', form.session_id);
    formData.append('token',form.token)
    return this.http.post(this.chatBotBaseUrl + "chats/summary", formData);
  }
  GrammerChange(body:any){
    const url = this.composeUrl + this.changeGrammer;
    return this.http.post(url, body)
  }
  ToneChange(body:any){
    const url = this.composeUrl + this.changeTone;
    return this.http.post(url, body)
  }
  LanguageChange(body:any){
    const url = this.composeUrl + this.changeLanguage;
    return this.http.post(url, body)
  }
}
