import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppTranslateLoader } from './core/i18n/app-translate.loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: AppTranslateLoader
        }
      })
    ),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // 👈 always scroll to top
        anchorScrolling: 'enabled'
      })
    ),
    provideClientHydration(withEventReplay())
  ]
};
