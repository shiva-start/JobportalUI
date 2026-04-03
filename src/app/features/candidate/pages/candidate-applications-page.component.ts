import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationStatus } from '../../../models';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-candidate-applications-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
        <p class="mt-2 text-sm text-gray-500">Statuses are read only and updated only by employers or recruiters.</p>
      </div>

      <div *ngIf="rows.length; else empty" class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_160px_160px] gap-4 border-b border-gray-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 md:grid">
          <span>Job Title</span>
          <span>Company</span>
          <span>Applied Date</span>
          <span>Status</span>
        </div>

        <div class="divide-y divide-gray-100">
          <div *ngFor="let row of rows" class="grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_160px_160px] md:items-center">
            <div>
              <a [routerLink]="['/jobs', row.job.id]" class="font-semibold text-gray-900 hover:text-blue-600">{{ row.job.title }}</a>
              <p class="mt-1 text-sm text-gray-500">{{ row.job.location }}</p>
            </div>
            <p class="text-sm text-gray-600">{{ row.job.company }}</p>
            <p class="text-sm text-gray-500">{{ row.appliedDate }}</p>
            <span [class]="badgeClass(row.status)" class="w-fit px-2 py-1 text-xs rounded-full">
              {{ jobService.formatApplicationStatus(row.status) }}
            </span>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400">No data available</p>
        </div>
      </ng-template>
    </section>
  `,
})
export class CandidateApplicationsPageComponent {
  readonly jobService = inject(JobService);
  readonly rows = this.jobService.getAppliedJobs().map(job => ({
    job,
    appliedDate: this.jobService.getApplicationDate(job.id),
    status: this.jobService.getApplicationStatus(job.id),
  }));

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
}
