import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, {
    ...(config || {}),
    providers: [
      provideHttpClient(),
      ...((config && Array.isArray((config as any).providers) ? (config as any).providers : []))
    ]
  }, context);

export default bootstrap;
