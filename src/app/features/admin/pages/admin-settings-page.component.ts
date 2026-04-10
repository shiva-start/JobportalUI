import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.SETTINGS.PLATFORM_CONFIGURATION.TITLE' | translate }}</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.SETTINGS.PLATFORM_CONFIGURATION.DESCRIPTION' | translate }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.SETTINGS.JOB_CATEGORIES.TITLE' | translate }}</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.SETTINGS.JOB_CATEGORIES.DESCRIPTION' | translate }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.SETTINGS.SKILL_LIBRARY.TITLE' | translate }}</h2>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.SETTINGS.SKILL_LIBRARY.DESCRIPTION' | translate }}</p>
      </div>
    </section>
  `,
})
export class AdminSettingsPageComponent {
  readonly languageService = inject(LanguageService);
}
