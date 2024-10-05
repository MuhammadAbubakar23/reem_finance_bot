import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  baseUrl = environment.baseUrl
  private siblingMsg2 = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) { }

  getMessage = this.siblingMsg2.asObservable();
  public updateMessage(menuName: string): void {
    this.siblingMsg2.next(menuName);
  }

  getMenus() {
    if (!localStorage.getItem("BotMenuPreviews")) {
      return this.http.get(this.baseUrl + "Roles/BotMenuPreviews");
    }
    else {
      return JSON.parse(localStorage.getItem("BotMenuPreviews") || '[]')
    }
  }

}
