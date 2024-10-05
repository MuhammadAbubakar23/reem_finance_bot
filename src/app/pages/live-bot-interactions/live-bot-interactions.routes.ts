import { Routes } from "@angular/router";
import { BotMonitoringComponent } from "./bot-monitoring/bot-monitoring.component";

export const routes: Routes = [
  { path: '', redirectTo: 'bot-interaction', pathMatch: 'full' },
  { path: 'bot-interaction', component: BotMonitoringComponent }
];
