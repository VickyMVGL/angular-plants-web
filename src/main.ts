// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/* --- restoreSavedTheme (mantén exactamente tu bloque actual) --- */
(function restoreSavedTheme() {
  /* ... tu lógica actual ... */
})();

/* --- construir providers correctamente --- */
// Normaliza providers existentes (si appConfig.providers es un array lo usamos, si no usamos [])
const existingProviders = Array.isArray((appConfig as any)?.providers)
  ? (appConfig as any).providers
  : [];

// Añadimos provideHttpClient() para registrar HttpClient en el injector raíz
const mergedProviders = [
  ...existingProviders,
  provideHttpClient()
];

const mergedConfig = {
  ...(appConfig || {}),
  providers: mergedProviders
};

bootstrapApplication(App, mergedConfig).catch((err) => console.error(err));
