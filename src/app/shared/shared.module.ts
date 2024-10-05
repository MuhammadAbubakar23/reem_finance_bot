import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { ThousandSuffPipe } from './pipes/thousand-suff.pipe';
import { ChatWidget2Component } from './components/layout/chat-widget2/chat-widget2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { MenuChatWidgetComponent } from './components/layout/menu-chat-widget/menu-chat-widget.component';

@NgModule({
  declarations: [ClickOutsideDirective,CustomDatePipe,ThousandSuffPipe, ChatWidget2Component, MenuChatWidgetComponent],
  exports: [ClickOutsideDirective,CustomDatePipe,ThousandSuffPipe, ChatWidget2Component, MenuChatWidgetComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MarkdownModule, DatePipe],
  providers: [DatePipe, provideMarkdown()]
})
export class SharedModule {}
