import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';
import { JobService } from '../../../core/services/job.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-overview-page',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <p class="text-sm font-medium text-blue-600">Welcome back</p>
        <h1 class="mt-1 text-2xl font-bold text-gray-900">Your candidate dashboard is ready</h1>
        <p class="mt-2 text-sm text-gray-500">
          Track your applications, complete your profile, and stay on top of recruiter activity.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let stat of candidate.dashboardStats()" class="bg-white rounded-xl shadow-sm p-4">
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">Recommended jobs</h2>
            <a routerLink="/candidate/jobs" class="text-sm font-medium text-blue-600 hover:text-blue-700">See all</a>
          </div>

          <div *ngIf="candidate.recommendedJobs().length; else noJobs" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-job-card
              *ngFor="let job of candidate.recommendedJobs().slice(0, 4)"
              [job]="job"
              [saved]="jobService.isJobSaved(job.id)"
              (saveToggle)="toggleSave($event)"
            ></app-job-card>
          </div>

          <ng-template #noJobs>
            <p class="text-gray-400">No data available</p>
          </ng-template>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-5">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900">Recent activity</h2>
              <a routerLink="/candidate/applications" class="text-sm font-medium text-blue-600 hover:text-blue-700">Applications</a>
            </div>

            <div *ngIf="candidate.recentActivity().length; else noActivity" class="space-y-4">
              <div *ngFor="let item of candidate.recentActivity()" class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p class="text-sm font-semibold text-gray-900">{{ item.title }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                <p class="mt-2 text-xs text-gray-400">{{ item.date | date:'mediumDate' }}</p>
              </div>
            </div>

            <ng-template #noActivity>
              <p class="text-gray-400">No data available</p>
            </ng-template>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-5">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="font-semibold text-gray-900">Latest updates</h2>
              <a routerLink="/candidate/notifications" class="text-sm font-medium text-blue-600 hover:text-blue-700">Notifications</a>
            </div>

            <div *ngIf="candidate.notifications().length; else noNotifications" class="space-y-3">
              <div *ngFor="let note of candidate.notifications().slice(0, 3)" class="rounded-xl border border-gray-100 p-4">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-semibold text-gray-900">{{ note.title }}</p>
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600" *ngIf="!note.read">New</span>
                </div>
                <p class="mt-1 text-sm text-gray-500">{{ note.message }}</p>
              </div>
            </div>

            <ng-template #noNotifications>
              <p class="text-gray-400">No data available</p>
            </ng-template>
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
