import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { JobService } from '../../../core/services/job.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-overview-page',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent, TranslatePipe],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <p class="text-sm font-medium text-blue-600">{{ 'CANDIDATE.OVERVIEW.WELCOME' | translate }}</p>
        <h1 class="mt-1 text-2xl font-bold text-gray-900">{{ 'CANDIDATE.OVERVIEW.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500">{{ 'CANDIDATE.OVERVIEW.SUBTITLE' | translate }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (stat of candidate.dashboardStats(); track stat.label) {
          <div class="bg-white rounded-xl shadow-sm p-4">
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">{{ 'CANDIDATE.OVERVIEW.RECOMMENDED_JOBS' | translate }}</h2>
            <a routerLink="/candidate/jobs" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.OVERVIEW.SEE_ALL' | translate }}</a>
          </div>

          @if (candidate.recommendedJobs().length) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (job of candidate.recommendedJobs().slice(0, 4); track job.id) {
                <app-job-card [job]="job" [saved]="jobService.isJobSaved(job.id)" (saveToggle)="toggleSave($event)"></app-job-card>
              }
            </div>
          } @else {
            <p class="text-gray-400">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
          }
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-5">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900">{{ 'CANDIDATE.OVERVIEW.RECENT_ACTIVITY' | translate }}</h2>
              <a routerLink="/candidate/applications" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.OVERVIEW.APPLICATIONS_LINK' | translate }}</a>
            </div>

            @if (candidate.recentActivity().length) {
              <div class="space-y-4">
                @for (item of candidate.recentActivity(); track item.id) {
                  <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p class="text-sm font-semibold text-gray-900">{{ item.title }}</p>
                    <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                    <p class="mt-2 text-xs text-gray-400">{{ item.date | date:'mediumDate' }}</p>
                  </div>
                }
              </div>
            } @else {
              <p class="text-gray-400">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
            }
          </div>

          <div class="bg-white rounded-xl shadow-sm p-5">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900">{{ 'CANDIDATE.OVERVIEW.LATEST_UPDATES' | translate }}</h2>
              <a routerLink="/candidate/notifications" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.OVERVIEW.NOTIFICATIONS_LINK' | translate }}</a>
            </div>

            @if (candidate.notifications().length) {
              <div class="space-y-3">
                @for (note of candidate.notifications().slice(0, 3); track note.id) {
                  <div class="rounded-xl border border-gray-100 p-4">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-gray-900">{{ note.title }}</p>
                      @if (!note.read) {
                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">{{ 'CANDIDATE.OVERVIEW.NEW_BADGE' | translate }}</span>
                      }
                    </div>
                    <p class="mt-1 text-sm text-gray-500">{{ note.message }}</p>
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

  toggleSave(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
  }

}
