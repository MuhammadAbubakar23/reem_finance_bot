import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private showGenerativeMenuSubject = new BehaviorSubject<any>('');
  showGenerativeMenu$ = this.showGenerativeMenuSubject.asObservable();

  setShowGenerativeMenu(value: any) {
    this.showGenerativeMenuSubject.next(value);
  }
  
  private showChatWidgetSubject = new BehaviorSubject<any>(false);
  showChatWidget$ = this.showChatWidgetSubject.asObservable();

  setShowChatWidget(value: any) {
    this.showChatWidgetSubject.next(value);
  }
  private showMenuChatWidgetSubject = new BehaviorSubject<any>(false);
  showMenuChatWidget$ = this.showMenuChatWidgetSubject.asObservable();

  setShowMenuChatWidget(value: any) {
    this.showMenuChatWidgetSubject.next(value);
  }
}
