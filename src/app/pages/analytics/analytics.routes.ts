// Angular modules
import { Routes } from '@angular/router';
import { AiBotAnalyticsComponent } from './ai-bot-analytics/ai-bot-analytics.component';
import { AiDashboardComponent } from './ai-dashboard/ai-dashboard.component';
import { BotKpiComponent } from './bot-kpi/bot-kpi.component';
import { ConversationAnalyticsComponent } from './conversation-analytics/conversation-analytics.component';
import { PowerBiComponent } from './power-bi/power-bi/power-bi.component';
import { SentimentsAndTagsComponent } from './sentiments-and-tags/sentiments-and-tags.component';
import { TokensComponent } from './tokens/tokens.component';


export const routes: Routes = [
  { path: '', redirectTo: 'bot-analytics', pathMatch: 'full' },
  { path: 'bot-analytics', component: AiBotAnalyticsComponent },
  { path: 'conversation', component: ConversationAnalyticsComponent },
  { path: 'bot-kpis', component: BotKpiComponent },
  { path: 'sentiments', component: SentimentsAndTagsComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'ai-dashboard', component: AiDashboardComponent},
  { path: 'power-bi', component: PowerBiComponent}
];
