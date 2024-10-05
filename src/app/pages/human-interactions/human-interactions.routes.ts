import { Routes } from "@angular/router";
import { ChatHistoryComponent } from "./chat-history/chat-history.component";

export const routes: Routes = [
  { path: '', redirectTo: 'conversations', pathMatch: 'full' },
  { path: 'conversations', component: ChatHistoryComponent }
];
