import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../shared/components/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'ai-bot',
        loadChildren: () => import('./live-bot-interactions/live-bot-interactions.routes').then(m => m.routes)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./analytics/analytics.routes').then(m => m.routes),
      },
      {
        path: 'chat-history',
        loadChildren: () => import('./chat-history/chat-history.routes').then(m => m.routes),
      },
      {
        path: 'human-interactions',
        loadChildren: () => import('./human-interactions/human-interactions.routes').then(m => m.routes),
      },
      {
        path: 'console',
        loadChildren: () => import('./console/console.routes').then(m => m.routes),
      },
      {
        path: 'human-agent-takeover',
        loadChildren: () => import('./human-agent-takeover/human-agent-takeover.routes').then(m => m.routes)
      },
      // Uncomment or remove the comment to enable this route if needed
      // { path: 'console', loadChildren: () => import('./console/console.module').then(m => m.ConsoleModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
