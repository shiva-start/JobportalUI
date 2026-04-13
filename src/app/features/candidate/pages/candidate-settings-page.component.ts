import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-candidate-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.SETTINGS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.SETTINGS.SUBTITLE' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'CANDIDATE.SETTINGS.CHANGE_PASSWORD' | translate }}</h2>
          <p class="mt-1 text-sm text-gray-500 rtl:text-right">{{ auth.currentUser()?.email }}</p>
          <input
            [(ngModel)]="password"
            type="password"
            [placeholder]="'CANDIDATE.SETTINGS.PASSWORD_PLACEHOLDER' | translate"
            class="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <button type="button" (click)="updatePassword()" class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            {{ 'CANDIDATE.SETTINGS.UPDATE_PASSWORD' | translate }}
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex items-start justify-between gap-4 rtl:flex-row-reverse">
            <div>
              <h2 class="font-semibold text-gray-900 rtl:text-right">{{ 'CANDIDATE.SETTINGS.PROFILE_VISIBILITY' | translate }}</h2>
              <p class="mt-1 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.SETTINGS.PROFILE_VISIBILITY_DESCRIPTION' | translate }}</p>
            </div>
            <label class="inline-flex cursor-pointer items-center">
              <input type="checkbox" [ngModel]="candidate.profile().visibility" (ngModelChange)="setVisibility($event)" class="h-5 w-5 rounded border-gray-300 text-blue-600">
            </label>
          </div>
          <p class="mt-4 text-sm text-gray-400 rtl:text-right">
            {{ candidate.profile().visibility
              ? ('CANDIDATE.SETTINGS.VISIBILITY_VISIBLE' | translate)
              : ('CANDIDATE.SETTINGS.VISIBILITY_HIDDEN' | translate) }}
          </p>
        </div>
      </div>
    </section>
  `,
})
export class CandidateSettingsPageComponent {
  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  readonly languageService = inject(LanguageService);

  password = '';

  updatePassword(): void {
    if (!this.password.trim()) {
      this.toast.error(this.translate.instant('CANDIDATE.SETTINGS.TOASTS.PASSWORD_REQUIRED'));
      return;
    }
    this.candidate.updatePassword(this.password);
    this.password = '';
    this.toast.success(this.translate.instant('CANDIDATE.SETTINGS.TOASTS.PASSWORD_UPDATED'));
  }

  setVisibility(visible: boolean): void {
    this.candidate.updateVisibility(visible);
    this.toast.success(this.translate.instant(
      visible ? 'CANDIDATE.SETTINGS.TOASTS.VISIBILITY_VISIBLE' : 'CANDIDATE.SETTINGS.TOASTS.VISIBILITY_UPDATED'
    ));
  }
}
