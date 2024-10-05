import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueSettingService {
  default:any="create";

  private nameSubject = new BehaviorSubject<any>(null);
  private documentsSubject = new BehaviorSubject<any>(null);
  private editFormValuesSubject = new BehaviorSubject<any>(null);
  private workspaceIdSubject = new BehaviorSubject<any>(null);
  private botListSubject = new BehaviorSubject<any>(null);

  name$ = this.nameSubject.asObservable();
  documents$ = this.documentsSubject.asObservable();
  editFormValues$ = this.editFormValuesSubject.asObservable();
  workspace_Id$ = this.workspaceIdSubject.asObservable();
  botList$ = this.botListSubject.asObservable();
  constructor() { }

  setDocuments(docs: any, workspace_id: any) {
    this.documentsSubject.next(docs);
    this.workspaceIdSubject.next(workspace_id);
  }

  setName(name: any) {
    this.nameSubject.next(name);
  }

  setEditFormValues(editFormVal: any, workspace_id: any) {
    this.editFormValuesSubject.next(editFormVal);
    this.workspaceIdSubject.next(workspace_id);
  }

  setBotsList(botList:any){
    this.botListSubject.next(botList)
  }
}
