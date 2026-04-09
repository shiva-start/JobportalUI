import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ApplicationStatus, ApplicationRecord } from '../../../models';
import { JobService } from '../../../core/services/job.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-candidate-applications-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <section [dir]="isArabic() ? 'rtl' : 'ltr'" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.APPLICATIONS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.APPLICATIONS.SUBTITLE' | translate }}</p>
      </div>

      @if (rows().length) {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_160px_160px] gap-4 border-b border-gray-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 md:grid">
            <span class="rtl:text-right">{{ 'CANDIDATE.APPLICATIONS.JOB_TITLE' | translate }}</span>
            <span class="rtl:text-right">{{ 'CANDIDATE.APPLICATIONS.COMPANY' | translate }}</span>
            <span class="rtl:text-right">{{ 'CANDIDATE.APPLICATIONS.APPLIED_DATE' | translate }}</span>
            <span class="rtl:text-right">{{ 'CANDIDATE.APPLICATIONS.STATUS' | translate }}</span>
          </div>
          <div class="divide-y divide-gray-100">
            @for (row of rows(); track row.job.id) {
              <div class="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_160px_160px] md:items-center">
                <div class="rtl:text-right">
                  <a [routerLink]="['/jobs', row.job.id]" class="font-semibold text-gray-900 hover:text-blue-600">
                    {{ row.job.title }}
                  </a>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ row.job.location }}
                  </p>
                </div>
                <p class="text-sm text-gray-600 rtl:text-right">{{ row.job.company }}</p>
                <p class="text-sm text-gray-500 rtl:text-right">{{ row.appliedDate }}</p>
                <span [class]="badgeClass(row.status)" class="w-fit px-2 py-1 text-xs rounded-full">
                  {{ row.statusLabelKey | translate }}
                </span>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
        </div>
      }
    </section>
  `,
})
export class CandidateApplicationsPageComponent {
  readonly jobService = inject(JobService);
  readonly languageService = inject(LanguageService);
  readonly rows = computed(() => {
    const language = this.languageService.currentLanguage();
    const applicationDetails = this.jobService.getApplicationDetails();

    return this.jobService.getAppliedJobs().map(job => ({
      job,
      appliedDate: this.formatAppliedDate(job.id, language, applicationDetails),
      status: this.jobService.getApplicationStatus(job.id),
      statusLabelKey: this.jobService.getApplicationStatusKey(
        applicationDetails.find(detail => detail.jobId === job.id)?.status ?? 'applied',
      ),
    }));
  });

  badgeClass(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      applied: 'bg-blue-100 text-blue-600',
      'under-review': 'bg-amber-100 text-amber-600',
      shortlisted: 'bg-green-100 text-green-600',
      'interview-scheduled': 'bg-indigo-100 text-indigo-600',
      rejected: 'bg-red-100 text-red-600',
      selected: 'bg-emerald-100 text-emerald-600',
    };
    return map[status];
  }

  isArabic(): boolean {
    return this.languageService.currentLanguage() === 'ar';
  }

  private formatAppliedDate(
    jobId: string,
    language: 'en' | 'ar',
    applicationDetails: ApplicationRecord[],
  ): string {
    const rawDate = applicationDetails.find(detail => detail.jobId === jobId)?.appliedAt;
    if (!rawDate) {
      return '';
    }

    return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(rawDate));
  }
}
