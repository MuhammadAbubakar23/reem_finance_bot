import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderService } from '../../../../core/services/header.service';
import { SharedService } from '../../../../core/services/shared.service';


declare function changeTheme(color: any): any
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  username = "";
  initial = ""
  email ="";
  headerData: any = {

  };
  currentroute: any;
  isWidget: boolean = false;
  menuWidget: boolean=false;
  constructor(private _headerService: HeaderService, private router: Router, private _authS: AuthService, private sharedService: SharedService) {
    const urlSegments = this.router.url.split('/');
    const moduleSegment = urlSegments[2];
  }

  changeColors(color: any) {
    changeTheme(color)
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || "";
    this.initial = localStorage.getItem('initial') || "";
    this.email=localStorage.getItem('originalUserName')||"";

    this._headerService.currentHeaderData.subscribe((data: any) => {
      this.headerData = data;

    });
    this.sharedService.showChatWidget$.subscribe((value:any) => {
      if (value != null && value !== undefined) {
        this.isWidget = value;
      }
    })

  }

  showChatWidget2() {
    this.isWidget = !this.isWidget;
    this.sharedService.setShowChatWidget(this.isWidget);
  }
  showMenuChatWidget(){
    this.menuWidget = !this.menuWidget;
    this.sharedService.setShowMenuChatWidget(this.menuWidget);
  }

  signOut() {
    this._authS.doLogout();
  }

  navigateTab(url: any) {
    this.router.navigateByUrl(url);
  }

  getInitials(value: string): string
  {
    if (!value) {
      return '';
    }
    const words = value.split(' ');
    const initials = words.map(word => word.charAt(0)).join('').slice(0, 2);
    return initials.toUpperCase();
  }
}
