import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.routes),
  },
   { path: '', redirectTo: '/bot/analytics', pathMatch: 'full' },
  // {
  //   path: 'bot',
  //   component: MainLayoutComponent,
  //   loadChildren: () => import('./pages/analytics/analytics.routes').then(m => m.routes),
  //   canActivate: [AuthGuard]
  // },
    {
    path: 'bot',
    loadChildren: () => import('./pages/main.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
];
