import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { 
        prefix: '/assets/i18n/', // Changed from ./ to /
        suffix: '.json' 
      }
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
          deps: [HttpClient, TRANSLATE_HTTP_LOADER_CONFIG]
        },
        defaultLanguage: 'en'
      })
    )
  ]
};