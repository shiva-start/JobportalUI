import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Job } from '../../../models';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, JobCardComponent],
  templateUrl: './job-detail.component.html'
})
export class JobDetailComponent implements OnInit {
  jobService = inject(JobService);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  job: Job | null = null;
  relatedJobs: Job[] = [];

  get jobInfo() {
    if (!this.job) return [];
    return [
      { svgPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z', label: 'Category', value: this.job.category },
      { svgPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Posted', value: this.timeAgo(this.job.postedAt) },
      { svgPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Job Type', value: this.formatType(this.job.type) },
      { svgPath: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Experience', value: this.formatLevel(this.job.experienceLevel) },
      ...(this.job.salary ? [{ svgPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Salary', value: this.job.salary }] : []),
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
      this.toastService.info('Please sign in to apply');
      this.router.navigate(['/login']);
      return;
    }
    this.jobService.applyToJob(this.job!.id);
    this.toastService.success('Application submitted successfully.');
  }

  toggleSave(): void {
    this.jobService.toggleSaveJob(this.job!.id);
    const saved = this.jobService.isJobSaved(this.job!.id);
    this.toastService.success(saved ? 'Job saved to your list!' : 'Job removed from saved.');
  }

  shareJob(): void {
    this.toastService.info('Link copied to clipboard!');
  }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    this.toastService.success(this.jobService.isJobSaved(jobId) ? 'Job saved!' : 'Job removed.');
  }

  formatType(type: string): string {
    return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  formatLevel(level: string): string {
    const map: Record<string, string> = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior', lead: 'Lead', executive: 'Executive' };
    return map[level] || level;
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  }
}
