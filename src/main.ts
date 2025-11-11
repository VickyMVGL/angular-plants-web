// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

/* --- restoreSavedTheme (mantén tu bloque actual) --- */
(function restoreSavedTheme() {
  /* ... tu lógica actual ... */
})();

/* --- construir providers correctamente --- */
const existingProviders = Array.isArray((appConfig as any)?.providers)
  ? (appConfig as any).providers
  : [];

// bootstrap de la app con HttpClient moderno
bootstrapApplication(App, {
  ...(appConfig || {}),
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Angular 20: registra HttpClient sin HttpClientModule
    ...existingProviders
  ]
}).catch((err) => console.error(err));
