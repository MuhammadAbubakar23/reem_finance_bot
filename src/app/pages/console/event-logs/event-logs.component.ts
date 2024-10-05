import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';


@Component({
  selector: 'app-event-logs',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './event-logs.component.html',
  styleUrls: ['./event-logs.component.scss']
})
export class EventLogsComponent {
  constructor(private _hS: HeaderService, private sidenavService: SidenavService) {
    _hS.updateHeaderData({
      title: 'Event Logs',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class:"fa-light fa-calendar"
    })
  }
}
