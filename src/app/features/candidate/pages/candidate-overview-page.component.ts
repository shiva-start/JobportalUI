import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { JobService } from '../../../core/services/job.service';
import { LanguageService } from '../../../core/services/language.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-overview-page',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent, TranslatePipe],
  template: `
    <section
      [dir]="isArabic() ? 'rtl' : 'ltr'"
      class="w-full max-w-full space-y-6 overflow-hidden"
    >
      <div class="w-full max-w-full overflow-hidden rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <p class="break-words text-sm font-medium text-blue-600 rtl:text-right">{{ 'CANDIDATE.OVERVIEW.WELCOME' | translate }}</p>
        <h1 class="mt-1 break-words text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.OVERVIEW.TITLE' | translate }}</h1>
        <p class="mt-2 break-words whitespace-normal text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.OVERVIEW.SUBTITLE' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (stat of candidate.dashboardStats(); track stat.labelKey) {
          <div class="w-full max-w-full overflow-hidden rounded-xl bg-white p-4 shadow-sm">
            <p class="break-words text-sm text-gray-500 rtl:text-right">{{ stat.labelKey | translate }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div class="w-full max-w-full overflow-hidden rounded-xl bg-white p-5 shadow-sm">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 class="min-w-0 flex-1 break-words text-base font-semibold text-gray-900 rtl:text-right">{{ 'CANDIDATE.OVERVIEW.RECOMMENDED_JOBS' | translate }}</h2>
            <a routerLink="/candidate/jobs" class="max-w-full shrink-0 truncate text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.OVERVIEW.SEE_ALL' | translate }}</a>
          </div>

          @if (candidate.recommendedJobs().length) {
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              @for (job of candidate.recommendedJobs().slice(0, 4); track job.id) {
                <app-job-card [job]="job" [saved]="jobService.isJobSaved(job.id)" (saveToggle)="toggleSave($event)"></app-job-card>
              }
            </div>
          } @else {
            <p class="text-gray-400">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
          }
        </div>

        <div class="w-full max-w-full space-y-6 overflow-hidden">
          <div class="w-full max-w-full overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h2 class="break-words text-base font-semibold text-gray-900 rtl:text-right">{{ 'CANDIDATE.OVERVIEW.RECENT_ACTIVITY' | translate }}</h2>
                <p class="mt-1 break-words whitespace-normal text-sm text-gray-500 rtl:text-right">
                  {{ 'CANDIDATE.OVERVIEW.RECENT_ACTIVITY_SUBTITLE' | translate }}
                </p>
              </div>
              <a routerLink="/candidate/applications" class="max-w-full shrink-0 truncate text-sm font-medium text-blue-600 hover:text-blue-700">
                {{ 'CANDIDATE.OVERVIEW.APPLICATIONS_LINK' | translate }}
              </a>
            </div>

            @if (candidate.recentActivity().length) {
              <div class="w-full max-w-full space-y-4 overflow-hidden">
                @for (item of candidate.recentActivity(); track item.id) {
                  <div class="w-full max-w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div class="flex items-start gap-3 rtl:flex-row-reverse">
                      <div class="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-500 mt-1.5"></div>
                      <div class="min-w-0 flex-1">
                        <p class="break-words text-sm font-semibold text-gray-900 rtl:text-right">
                          {{ item.title }}
                        </p>
                        <p class="mt-1 break-words whitespace-normal text-sm text-gray-500 rtl:text-right">
                          {{ item.description }}
                        </p>
                        <p class="mt-2 break-words text-xs text-gray-400 rtl:text-right">
                          {{ $any(item).dateLabel || (item.date | date:'mediumDate') }}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-gray-400">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
            }
          </div>

          <div class="w-full max-w-full overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h2 class="break-words text-base font-semibold text-gray-900 rtl:text-right">{{ 'CANDIDATE.OVERVIEW.LATEST_UPDATES' | translate }}</h2>
                <p class="mt-1 break-words whitespace-normal text-sm text-gray-500 rtl:text-right">
                  {{ 'CANDIDATE.OVERVIEW.LATEST_UPDATES_SUBTITLE' | translate }}
                </p>
              </div>
              <a routerLink="/candidate/notifications" class="max-w-full shrink-0 truncate text-sm font-medium text-blue-600 hover:text-blue-700">
                {{ 'CANDIDATE.OVERVIEW.NOTIFICATIONS_LINK' | translate }}
              </a>
            </div>

            @if (candidate.notifications().length) {
              <div class="w-full max-w-full space-y-3 overflow-hidden">
                @for (note of candidate.localizedNotifications().slice(0, 3); track note.id) {
                  <div class="w-full max-w-full overflow-hidden rounded-xl border border-gray-100 p-4">
                    <div class="flex items-start justify-between gap-3 rtl:flex-row-reverse">
                      <div class="min-w-0 flex-1">
                        <p class="break-words text-sm font-semibold text-gray-900 rtl:text-right">{{ note.title }}</p>
                        <p class="mt-1 break-words whitespace-normal text-sm text-gray-500 rtl:text-right">{{ note.message }}</p>
                      </div>
                      @if (!note.read) {
                        <span class="max-w-full flex-shrink-0 truncate rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">{{ 'CANDIDATE.OVERVIEW.NEW_BADGE' | translate }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="text-gray-400">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CandidateOverviewPageComponent {
  readonly candidate = inject(CandidateDashboardService);
  readonly jobService = inject(JobService);
  readonly languageService = inject(LanguageService);

  toggleSave(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
  }

  isArabic(): boolean {
    return this.languageService.currentLanguage() === 'ar';
  }
}
