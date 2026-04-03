import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';

@Component({
  selector: 'app-admin-jobs-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-xl shadow-sm p-4">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Jobs</h1>
      <p class="mb-4 text-sm text-gray-500">Monitor postings and remove only spam, fake, or offensive jobs when needed.</p>
      <div *ngIf="admin.jobsList().length; else empty" class="space-y-3">
        <div *ngFor="let job of admin.jobsList()" class="rounded-xl border border-gray-100 p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900">{{ job.title }}</p>
              <p class="text-sm text-gray-500">{{ job.company }} · {{ job.location }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{{ job.moderationStatus || 'approved' }}</span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button type="button" (click)="admin.updateJobStatus(job.id, 'rejected')" class="px-3 py-1 rounded-lg text-sm font-medium bg-amber-100 text-amber-700">Flag</button>
            <button type="button" (click)="admin.removeJob(job.id)" class="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">Remove</button>
          </div>
        </div>
      </div>
      <ng-template #empty><p class="text-gray-400">No data available</p></ng-template>
    </section>
  `,
})
export class AdminJobsPageComponent {
  readonly admin = inject(AdminDashboardService);
}
