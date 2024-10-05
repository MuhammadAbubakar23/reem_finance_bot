import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  GetTags(formData:any) {
    return this.http.post(
      `${this.baseUrl}${"Tags/GetAll"}`, formData
    );
  }

  GetTagsById(id:any)
  {
    return this.http.get(`${this.baseUrl}${"Tags/GetById?"}id=${id}`);
  }

  DeleteTags(deleteId: string): Observable<any> {
    const url = `${this.baseUrl}${"Tags/Delete"}?id=${deleteId}`;
    return this.http.get(url);
  }
  Save(form: any) {
    return this.http.post(this.baseUrl + "Tags/Add", form);
  }
  Update(form: any) {
    return this.http.post(this.baseUrl + "Tags/Update", form);
  }
}
