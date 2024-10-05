import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private headerData = new BehaviorSubject<any>(
    {
    title: '',
    tabs:[],
    isTab: true,
  });

  currentHeaderData = this.headerData.asObservable();
  updateHeaderData(data:any) {
    this.headerData.next(data);
  }
}
