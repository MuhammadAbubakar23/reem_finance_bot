import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent {

}
