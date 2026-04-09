import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-employer-messages',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div [dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'EMPLOYER.MESSAGES.TITLE' | translate }}</h1>
          <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'EMPLOYER.MESSAGES.SUBTITLE' | translate }}</p>

          <div class="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
            <p class="text-sm font-semibold text-gray-900 rtl:text-right">{{ 'EMPLOYER.MESSAGES.OUTREACH_TITLE' | translate }}</p>
            <p class="mt-1 text-sm text-gray-500 rtl:text-right">{{ 'EMPLOYER.MESSAGES.EMPTY' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmployerMessagesComponent {
  readonly languageService = inject(LanguageService);
}
