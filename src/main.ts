import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { APP_PROVIDERS } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    ...APP_PROVIDERS
  ]
})
.catch(err => console.error(err));