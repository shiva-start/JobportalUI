import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import ar from '../../../../public/assets/i18n/ar.json';
import en from '../../../../public/assets/i18n/en.json';

@Injectable()
export class AppTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(lang === 'ar' ? ar : en);
  }
}
