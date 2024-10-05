import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';


@Component({
  selector: 'app-connect-channels',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './connect-channels.component.html',
  styleUrls: ['./connect-channels.component.scss']
})
export class ConnectChannelsComponent {
  constructor(private _hS: HeaderService, private sidenavService: SidenavService) {
    _hS.updateHeaderData({
      title: 'Connect Channels',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class:"fa-light fa-message-bot pe-2"
    })
  }
}
