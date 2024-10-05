import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-menu-bot',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './menu-bot.component.html',
  styleUrls: ['./menu-bot.component.scss']
})
export class MenuBotComponent {

}
