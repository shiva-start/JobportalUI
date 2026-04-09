import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-employer-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div [dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'EMPLOYER.SETTINGS.TITLE' | translate }}</h1>
            <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'EMPLOYER.SETTINGS.SUBTITLE' | translate }}</p>

            <input
              [(ngModel)]="password"
              type="password"
              [placeholder]="'EMPLOYER.SETTINGS.PASSWORD_PLACEHOLDER' | translate"
              class="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right"
            />
            <button
              type="button"
              (click)="savePassword()"
              class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {{ 'EMPLOYER.SETTINGS.UPDATE_PASSWORD' | translate }}
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 rtl:text-right">{{ 'EMPLOYER.SETTINGS.WORKSPACE' | translate }}</h2>
            <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ auth.currentUser()?.email }}</p>
            <div class="mt-5 rounded-xl bg-gray-50 p-4">
              <p class="text-sm text-gray-600 rtl:text-right">{{ 'EMPLOYER.SETTINGS.WORKSPACE_NOTE' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmployerSettingsComponent {
  readonly auth = inject(AuthService);
  readonly languageService = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  password = '';

  savePassword(): void {
    if (!this.password.trim()) {
      this.toast.error(this.translate.instant('EMPLOYER.TOASTS.PASSWORD_REQUIRED'));
      return;
    }
    this.password = '';
    this.toast.success(this.translate.instant('EMPLOYER.TOASTS.PASSWORD_UPDATED'));
  }
}
