import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-reports-page-localized',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'ADMIN.REPORTS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.REPORTS.SUBTITLE' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of admin.analytics()" class="bg-white rounded-xl shadow-sm p-4">
          <p class="text-sm text-gray-500 rtl:text-right">{{ item.label }}</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ item.value }}</p>
          <p class="mt-1 text-xs text-gray-400 rtl:text-right">{{ item.detail }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4">
        <h2 class="mb-4 text-lg font-semibold text-gray-900 rtl:text-right">{{ 'ADMIN.REPORTS.MODERATION_REPORTS' | translate }}</h2>
        <div *ngIf="admin.flaggedContent().length; else empty" class="space-y-3">
          <div *ngFor="let report of admin.flaggedContent()" class="rounded-xl border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900 rtl:text-right">{{ report.subject }}</p>
              <p class="text-sm text-gray-500 rtl:text-right">{{ report.type }} · {{ report.createdAt | date:'mediumDate' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ report.status }}</span>
              <button type="button" (click)="admin.resolveReport(report.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700">{{ 'ADMIN.REPORTS.RESOLVE' | translate }}</button>
            </div>
          </div>
        </div>
        <ng-template #empty><p class="text-gray-400 rtl:text-right">{{ 'COMMON.NO_DATA' | translate }}</p></ng-template>
      </div>
    </section>
  `,
})
export class AdminReportsPageLocalizedComponent {
  readonly admin = inject(AdminDashboardService);
  readonly languageService = inject(LanguageService);
}
