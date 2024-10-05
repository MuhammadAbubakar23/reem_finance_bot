import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }
   
  GetUsers(formData:any) {
    return this.http.get(
      `${this.baseUrl}${"Users/GetAll"}?pageIndex=${formData.pageNumber}&pageSize=${formData.pageSize}&searchText=${formData.search}`
    );
  }

  GetUsersById(id:any)
  {
    return this.http.get(`${this.baseUrl}${"Users/GetById/"}${id}`);
  }

  DeleteUser(deleteId: string): Observable<any> {
    const url = `${this.baseUrl}${"Identity/Delete"}?id=${deleteId}`;
    return this.http.get(url);
  }
  Save(form: any) {
    return this.http.post(this.baseUrl + "Identity/Add", form);
  }
  Update(form: any) {
    return this.http.post(this.baseUrl + "Identity/Update", form);
  }

  getMyRoles(): Observable<any> {
    return this.http.get(this.baseUrl+"Roles/BotMenuList");
    // return this.http.get<any>("UserRoles",{},"?roles=51&roles=57&roles=58").pipe(
    //   map((response: any) => {
    //     return response;  
    //   })
    // );
  }
  getMySkills(): Observable<any> {
    return this.http.get(this.baseUrl+"getUserSkills");
    // return this.request.getFromConsole<any>("getUserSkills", {}).pipe(
    //   map((response: any) => {
    //     return response;  
    //   })
    // );
  }
}
