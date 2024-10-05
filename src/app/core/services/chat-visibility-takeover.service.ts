import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatVisibilityTakeoverService {
  refreshHistoryArray:any[]=[];
  private newChatIdSubject = new BehaviorSubject<string | null>(null);
  newChatId$: Observable<string | null> = this.newChatIdSubject.asObservable();
  notifyNewChatId(chat: any) {
    this.newChatIdSubject.next(chat);
  }
  private activeIdSubject = new BehaviorSubject<any>(null);
  activeId$: Observable<any> = this.activeIdSubject.asObservable();
  removeActiveId(activeObj:any) {
    this.activeIdSubject.next(activeObj);
  }
  private thirdActiveSubject = new BehaviorSubject<string | null>(null);
  thirdActive$: Observable<string | null> = this.thirdActiveSubject.asObservable();
  notifythirdActive(chat: any) {
    this.thirdActiveSubject.next(chat);
  }

  private newChatIdSubjectHistory = new BehaviorSubject<string | null>(null);
  newChatIdHistory$: Observable<string | null> = this.newChatIdSubjectHistory.asObservable();
  notifyNewChatIdHistory(chat: any) {
    this.newChatIdSubjectHistory.next(chat);
  }
  private activeIdSubjectHistory = new BehaviorSubject<any>(null);
  activeIdHistory$: Observable<any> = this.activeIdSubjectHistory.asObservable();
  removeActiveIdHistory(activeObj:any) {
    this.activeIdSubjectHistory.next(activeObj);
  }
  private thirdActiveSubjectHistory = new BehaviorSubject<string | null>(null);
  thirdActiveHistory$: Observable<string | null> = this.thirdActiveSubjectHistory.asObservable();
  notifythirdActiveHistory(chat: any) {
    this.thirdActiveSubjectHistory.next(chat);
  }
  refreshMethod(slug:any){
    this.refreshHistoryArray.push(slug);
  }
}
