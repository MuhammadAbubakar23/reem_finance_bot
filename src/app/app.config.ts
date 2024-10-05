import { ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    importProvidersFrom([BrowserModule,BrowserAnimationsModule,ToastrModule.forRoot()]),
    // provideStore({ login: loginReducer }),
    // provideEffects([LoginEffects]),
    // provideStoreDevtools({
    //   maxAge: 25,
    //   logOnly: !isDevMode(),
    //   autoPause: true,
    //   trace: false,
    //   traceLimit: 75,
    //   connectInZone: true

    // }),
  ]
};
