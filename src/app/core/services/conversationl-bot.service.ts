import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { bot_id } from '../../../main';

const baseUrl = environment.conversationBotBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class ConversationlBotService {
  constructor(private http: HttpClient) { }


  createBot(data: any): Observable<any> {

    return this.http.post(baseUrl + "workspaces/create", data)
  }

  getBots(): Observable<any> {

    return this.http.get(baseUrl + `workspaces/get?bot_id=${bot_id}`)
  }
  getDocuments(params: any): Observable<any> {
    return this.http.get(baseUrl + "documents/get", { params });
  }
  getBotById(id: any): Observable<any> {
    return this.http.get(baseUrl + `Loan/GetLoanById/${id}`)
  }
  getPrompt(workspace_id:any){
    return this.http.get(baseUrl + `workspaces/get_prompt?bot_id=${bot_id}&workspace_id=${workspace_id}`)
  }
  updatePrompt(body:any){
    return this.http.post(baseUrl + "workspaces/update_prompt", body)
  }
  updateLimit(body:any){
    return this.http.post(baseUrl + "workspaces/update_limit", body)
  }
  updateSession(body:any){
    return this.http.post(baseUrl + "workspaces/update_session", body)
  }
  updatevectorDb(body:any){
    return this.http.post(baseUrl + "workspaces/update_vectordb", body)
  }
  updateEmbeddings(body:any){
    return this.http.post(baseUrl + "workspaces/update_embeddings", body)
  }
  updatellm(body:any){
    return this.http.post(baseUrl + "workspaces/update_llm", body)
  }
  getName(workspace_id:any){
    return this.http.get(baseUrl + `workspaces/get_name?bot_id=${bot_id}&workspace_id=${workspace_id}`)
  }
  getToken(workspace_id:any){
    return this.http.get(baseUrl + `tokens/get?bot_id=${bot_id}&workspace_id=${workspace_id}`)
  }
  createToken(formData:any){
    return this.http.post(baseUrl + 'tokens/regenerate', formData)
  }
  updateName(body:any){
    return this.http.post(baseUrl+"workspaces/update_name", body)
  }
  updateBot(data: any): Observable<any> {

    return this.http.put(baseUrl + "Loan/UpdateLoan", data)
  }

  createEmbeddings(body:any){
    return this.http.post(baseUrl + "embeddings/create", body)
  }


  uploadFile(formData: any): Observable<any>{
    return this.http.post(baseUrl+ "documents/upload", formData);
  }
  createDocument(formData: any): Observable<any>{
    return this.http.post(baseUrl+ "documents/create", formData);
  }

  disableDocument(body:any){
    return this.http.post(baseUrl + "documents/disable", body)
  }
  enableDocument(body:any){
    return this.http.post(baseUrl + "documents/enable", body)
  }
  deleteBot(id: any): Observable<any> {

    return this.http.delete(baseUrl + `Loan/DeleteLoan/${id}`)
  }





}

