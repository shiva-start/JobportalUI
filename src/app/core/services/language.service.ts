import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'app_language';
  private readonly defaultLanguage: AppLanguage = 'en';
  private readonly activeLanguage = signal<AppLanguage>(this.defaultLanguage);

  readonly currentLanguage = this.activeLanguage.asReadonly();
  readonly isRtl = computed(() => this.activeLanguage() === 'ar');
  readonly direction = computed(() => (this.isRtl() ? 'rtl' : 'ltr'));

  constructor(
    private readonly translate: TranslateService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang(this.defaultLanguage);
  }

  init(): void {
    this.setLanguage(this.getSavedLanguage());
  }

  setLanguage(language: AppLanguage): void {
    this.activeLanguage.set(language);
    this.syncDocument(language);

    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(language);
      localStorage.setItem(this.storageKey, language);
    }
  }

  toggleLanguage(): void {
    this.setLanguage(this.activeLanguage() === 'en' ? 'ar' : 'en');
  }

  private getSavedLanguage(): AppLanguage {
    if (!isPlatformBrowser(this.platformId)) {
      return this.defaultLanguage;
    }

    const savedLanguage = localStorage.getItem(this.storageKey);
    return savedLanguage === 'ar' ? 'ar' : this.defaultLanguage;
  }

  private syncDocument(language: AppLanguage): void {
    const html = this.document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}
