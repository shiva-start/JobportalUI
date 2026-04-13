import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { ToastService } from '../../../core/services/toast.service';
import { Job } from '../../../models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, JobCardComponent, TranslatePipe],
  templateUrl: './job-detail.component.html'
})
export class JobDetailComponent implements OnInit {
  jobService = inject(JobService);
  private auth = inject(AuthService);
  readonly languageService = inject(LanguageService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  job: Job | null = null;
  relatedJobs: Job[] = [];

  get jobInfo() {
    if (!this.job) return [];
    return [
      { svgPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z', labelKey: 'JOBS.DETAIL.OVERVIEW.CATEGORY', value: this.job.category },
      { svgPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', labelKey: 'JOBS.DETAIL.OVERVIEW.POSTED', value: this.timeAgo(this.job.postedAt) },
      { svgPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', labelKey: 'JOBS.DETAIL.OVERVIEW.JOB_TYPE', value: this.formatType(this.job.type) },
      { svgPath: 'M13 10V3L4 14h7v7l9-11h-7z', labelKey: 'JOBS.DETAIL.OVERVIEW.EXPERIENCE', value: this.formatLevel(this.job.experienceLevel) },
      ...(this.job.salary ? [{ svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', labelKey: 'JOBS.DETAIL.OVERVIEW.SALARY', value: this.job.salary }] : []),
    ];
  }

  get logoColor(): string {
    if (!this.job) return '';
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-teal-500 to-teal-700',
      'bg-gradient-to-br from-orange-500 to-orange-700',
    ];
    return colors[parseInt(this.job.id) % colors.length];
  }

  get typeVariant(): 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gray' {
    const map: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gray'> = {
      'full-time': 'blue', 'part-time': 'purple', 'contract': 'orange', 'remote': 'green', 'internship': 'teal'
    };
    return this.job ? (map[this.job.type] || 'gray') : 'gray';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loading.set(true);
      setTimeout(() => {
        this.job = this.jobService.getJobById(params['id']) || null;
        if (this.job) this.relatedJobs = this.jobService.getRelatedJobs(this.job);
        this.loading.set(false);
      }, 500);
    });
  }

  applyNow(): void {
    if (!this.auth.isAuthenticated()) {
      this.toastService.info(this.translate.instant('JOBS.DETAIL.TOASTS.LOGIN_REQUIRED'));
      this.router.navigate(['/login']);
      return;
    }
    this.jobService.applyToJob(this.job!.id);
    this.toastService.success(this.translate.instant('JOBS.DETAIL.TOASTS.APPLIED'));
  }

  toggleSave(): void {
    this.jobService.toggleSaveJob(this.job!.id);
    const saved = this.jobService.isJobSaved(this.job!.id);
    this.toastService.success(this.translate.instant(saved ? 'JOBS.TOASTS.SAVED' : 'JOBS.TOASTS.REMOVED'));
  }

  shareJob(): void {
    this.toastService.info(this.translate.instant('JOBS.DETAIL.TOASTS.LINK_COPIED'));
  }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    this.toastService.success(this.translate.instant(this.jobService.isJobSaved(jobId) ? 'JOBS.TOASTS.SAVED_SHORT' : 'JOBS.TOASTS.REMOVED_SHORT'));
  }

  formatType(type: string): string {
    // Normalize API-like values (e.g. full-time) into stable translation keys.
    const key = type.split('-').map(w => w.toUpperCase()).join('_');
    return this.translate.instant(`JOBS.TYPES.${key}`);
  }

  formatLevel(level: string): string {
    const key = level.toUpperCase();
    return this.translate.instant(`JOBS.LEVELS.${key}`);
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return this.translate.instant('COMMON.TIME.TODAY');
    if (diffDays === 1) return this.translate.instant('COMMON.TIME.DAY_AGO', { count: 1 });
    if (diffDays < 7) return this.translate.instant('COMMON.TIME.DAYS_AGO', { count: diffDays });
    if (diffDays < 30) return this.translate.instant('COMMON.TIME.WEEKS_AGO', { count: Math.floor(diffDays / 7) });
    return this.translate.instant('COMMON.TIME.MONTHS_AGO', { count: Math.floor(diffDays / 30) });
  }
}
