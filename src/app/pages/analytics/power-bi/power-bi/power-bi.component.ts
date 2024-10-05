import { Component } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from '../../../../core/services/header.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-power-bi',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './power-bi.component.html',
  styleUrls: ['./power-bi.component.scss']
})
export class PowerBiComponent {
  constructor(private _hS: HeaderService) {
    _hS.updateHeaderData({
      title: 'BI Analytics',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-chart-line-up"
    })
  }
}
