import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../users.service';
@Injectable({
  providedIn: 'root'
})
export class CreateUserResolver implements Resolve<any> {
  resroles?:[];
  resteams?:[];
  resskills?:[];
  constructor(private userService:UsersService){}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any>> {
    await this.funcRoles();
    await this.funcSkills();
    return of({role:this.resroles, team:this.resteams, skill:this.resskills});
  }
  async funcRoles(){
    this.userService.getMyRoles().subscribe((response: any) => this.resroles = response);
  }
  async funcSkills(){
    this.userService.getMySkills().subscribe({ next: (res: any) => this.resskills = res });
  }
}
