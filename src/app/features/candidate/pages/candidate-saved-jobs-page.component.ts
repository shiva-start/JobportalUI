import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { JobService } from '../../../core/services/job.service';
import { ToastService } from '../../../core/services/toast.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-candidate-saved-jobs-page',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent, TranslatePipe],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.SAVED_JOBS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.SAVED_JOBS.SUBTITLE' | translate }}</p>
      </div>

      @if (savedJobs.length) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (job of savedJobs; track job.id) {
            <app-job-card [job]="job" [saved]="true" (saveToggle)="toggleSave($event)"></app-job-card>
          }
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
          <a routerLink="/candidate/jobs" class="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            {{ 'CANDIDATE.SAVED_JOBS.BROWSE_JOBS' | translate }}
          </a>
        </div>
      }
    </section>
  `,
})
export class CandidateSavedJobsPageComponent {
  readonly jobService = inject(JobService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  get savedJobs() {
    return this.jobService.getSavedJobs();
  }

  toggleSave(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    this.toast.success(this.translate.instant(
      this.jobService.isJobSaved(jobId) ? 'JOBS.TOASTS.SAVED_SHORT' : 'JOBS.TOASTS.REMOVED_SHORT'
    ));
  }
}
