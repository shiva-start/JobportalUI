import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-jobs-page-localized',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section [attr.dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="bg-white rounded-xl shadow-sm p-4">
      <h1 class="mb-4 text-2xl font-bold text-gray-900 rtl:text-right">{{ 'ADMIN.JOBS.TITLE' | translate }}</h1>
      <p class="mb-4 text-sm text-gray-500 rtl:text-right">{{ 'ADMIN.JOBS.SUBTITLE' | translate }}</p>
      <div *ngIf="admin.jobsList().length; else empty" class="space-y-3">
        <div *ngFor="let job of admin.jobsList()" class="rounded-xl border border-gray-100 p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900 rtl:text-right">{{ job.title }}</p>
              <p class="text-sm text-gray-500 rtl:text-right">
                {{ companyKey(job.company) ? (companyKey(job.company)! | translate) : job.company }}
                ·
                {{ locationKey(job.location) ? (locationKey(job.location)! | translate) : job.location }}
              </p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ statusKey(job.moderationStatus) | translate }}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button type="button" (click)="admin.updateJobStatus(job.id, 'rejected')" class="px-3 py-1 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">{{ 'ADMIN.JOBS.FLAG' | translate }}</button>
            <button type="button" (click)="admin.removeJob(job.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">{{ 'ADMIN.JOBS.REMOVE' | translate }}</button>
          </div>
        </div>
      </div>
      <ng-template #empty><p class="text-gray-400 rtl:text-right">{{ 'COMMON.NO_DATA' | translate }}</p></ng-template>
    </section>
  `,
})
export class AdminJobsPageLocalizedComponent {
  readonly admin = inject(AdminDashboardService);
  readonly languageService = inject(LanguageService);

  private readonly companyKeyMap: Record<string, string> = {
    'TechNova Solutions': 'JOBS.CARD.COMPANIES.TECHNOVA_SOLUTIONS',
    'FinEdge Corp': 'JOBS.CARD.COMPANIES.FINEDGE_CORP',
  };

  private readonly locationKeyMap: Record<string, string> = {
    'Cairo, Egypt': 'JOBS.CARD.LOCATIONS.CAIRO_EGYPT',
    'Alexandria, Egypt': 'JOBS.CARD.LOCATIONS.ALEXANDRIA_EGYPT',
  };

  companyKey(value: string | undefined): string | null {
    return value ? this.companyKeyMap[value] ?? null : null;
  }

  locationKey(value: string | undefined): string | null {
    return value ? this.locationKeyMap[value] ?? null : null;
  }

  statusKey(status: string | undefined): string {
    const normalized = (status ?? 'approved').toUpperCase();
    return `ADMIN.JOBS.STATUS.${normalized}`;
  }
}
