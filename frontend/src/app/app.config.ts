import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MsalModule,
  MsalInterceptor,
  MsalGuard,
  MsalBroadcastService,
  MsalService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import {
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation
} from '@azure/msal-browser';
import { routes } from './app.routes';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: '498e47b6-e1a3-4881-ad4f-f2859feb9004',
    authority: 'https://CloudeGrupo2.b2clogin.com/CloudeGrupo2.onmicrosoft.com/B2C_1_grupo2',
    knownAuthorities: ['CloudeGrupo2.b2clogin.com'],
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(BrowserAnimationsModule),
    { provide: MSAL_INSTANCE, useValue: msalInstance },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: { scopes: ['openid', 'profile'] }
      }
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        // Mapa vacío: no intercepta ninguna URL automáticamente
        // El token se adjunta manualmente cuando sea necesario
        protectedResourceMap: new Map([])
      }
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
  ]
};
