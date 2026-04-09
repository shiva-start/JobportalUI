import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { JobService } from '../../../core/services/job.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-jobs-page',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCardComponent, TranslatePipe],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.JOBS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.JOBS.SUBTITLE' | translate }}</p>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            [(ngModel)]="filters.keyword"
            (ngModelChange)="applyFilters()"
            [placeholder]="'CANDIDATE.JOBS.SEARCH_PLACEHOLDER' | translate"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right"
          />
          <input
            [(ngModel)]="filters.location"
            (ngModelChange)="applyFilters()"
            [placeholder]="'CANDIDATE.JOBS.LOCATION_PLACEHOLDER' | translate"
            class="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 rtl:text-right"
          />
        </div>
      </div>

      @if (jobService.filteredJobs().length) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (job of jobService.filteredJobs(); track job.id) {
            <app-job-card [job]="job" [saved]="jobService.isJobSaved(job.id)" (saveToggle)="toggleSave($event)"></app-job-card>
          }
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
          <button type="button" (click)="clearFilters()" class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            {{ 'CANDIDATE.JOBS.RESET_FILTERS' | translate }}
          </button>
        </div>
      }
    </section>
  `,
})
export class CandidateJobsPageComponent {
  readonly jobService = inject(JobService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

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
    this.toast.success(this.translate.instant(
      this.jobService.isJobSaved(jobId) ? 'JOBS.TOASTS.SAVED_SHORT' : 'JOBS.TOASTS.REMOVED_SHORT'
    ));
  }
}
