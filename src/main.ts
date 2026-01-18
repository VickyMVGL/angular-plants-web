// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


(function restoreSavedTheme() {
})();

const existingProviders = Array.isArray((appConfig as any)?.providers)
  ? (appConfig as any).providers
  : [];

bootstrapApplication(App, {
  ...(appConfig || {}),
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Angular 20: registra HttpClient sin HttpClientModule
    ...existingProviders
  ]
}).catch((err) => console.error(err));
