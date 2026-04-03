import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-jobs-page',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCardComponent],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900">Jobs</h1>
        <p class="mt-2 text-sm text-gray-500">Search by keyword or location and save the roles you want to revisit.</p>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            [(ngModel)]="filters.keyword"
            (ngModelChange)="applyFilters()"
            placeholder="Search jobs, skills, or company"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
          <input
            [(ngModel)]="filters.location"
            (ngModelChange)="applyFilters()"
            placeholder="Filter by location"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div *ngIf="jobService.filteredJobs().length; else empty" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-job-card
          *ngFor="let job of jobService.filteredJobs()"
          [job]="job"
          [saved]="jobService.isJobSaved(job.id)"
          (saveToggle)="toggleSave($event)"
        ></app-job-card>
      </div>

      <ng-template #empty>
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400">No data available</p>
          <button type="button" (click)="clearFilters()" class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Reset filters
          </button>
        </div>
      </ng-template>
    </section>
  `,
})
export class CandidateJobsPageComponent {
  readonly jobService = inject(JobService);
  private readonly toast = inject(ToastService);

  filters = { ...this.jobService.getFilters() };

  applyFilters(): void {
    this.jobService.setFilters(this.filters);
  }

  clearFilters(): void {
    this.filters = { keyword: '', location: '', category: '', experienceLevel: '', type: '' };
    this.jobService.resetFilters();
  }

  toggleSave(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    this.toast.success(this.jobService.isJobSaved(jobId) ? 'Job saved!' : 'Job removed.');
  }
}
