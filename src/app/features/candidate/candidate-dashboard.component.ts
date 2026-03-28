import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

type Tab = 'overview' | 'applied' | 'saved' | 'profile';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, JobCardComponent, BadgeComponent],
  templateUrl: './candidate-dashboard.component.html'
})
export class CandidateDashboardComponent {
  auth = inject(AuthService);
  jobService = inject(JobService);
  private toastService = inject(ToastService);

  activeTab = signal<Tab>('overview');

  appliedJobs = () => this.jobService.getAppliedJobs();
  savedJobs = () => this.jobService.getSavedJobs();
  recommendedJobs = () => this.jobService.featuredJobs().slice(0, 4);

  navItems = [
    { id: 'overview' as Tab, svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Overview', badge: null },
    { id: 'applied' as Tab, svgPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Applied Jobs', badge: null },
    { id: 'saved' as Tab, svgPath: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', label: 'Saved Jobs', badge: null },
    { id: 'profile' as Tab, svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'My Profile', badge: null },
  ];

  get stats() {
    return [
      { value: this.appliedJobs().length, label: 'Applications', change: '+2 this week', positive: true },
      { value: this.savedJobs().length, label: 'Saved Jobs', change: null, positive: true },
      { value: 124, label: 'Profile Views', change: '+18% this week', positive: true },
      { value: 3, label: 'Interviews', change: null, positive: true },
    ];
  }

  applicationStatuses = [
    { label: 'Pending', variant: 'orange' as const },
    { label: 'Reviewed', variant: 'blue' as const },
    { label: 'Shortlisted', variant: 'green' as const },
    { label: 'Rejected', variant: 'red' as const },
  ];

  profileFields = [
    { label: 'Full Name', value: 'Ahmed Hassan' },
    { label: 'Email', value: 'ahmed.hassan@example.com' },
    { label: 'Phone', value: '+20 10 0000 0000' },
    { label: 'Location', value: 'Cairo, Egypt' },
    { label: 'Experience', value: '5+ years' },
    { label: 'Current Role', value: 'Frontend Developer' },
  ];

  demoSkills = ['React', 'TypeScript', 'Angular', 'Node.js', 'Tailwind CSS', 'GraphQL', 'Git'];

  getFirstName(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return 'there';
    return name.split(' ')[0] ?? 'there';
  }

  onSaveJob(jobId: string): void {
    this.jobService.toggleSaveJob(jobId);
    this.toastService.success(this.jobService.isJobSaved(jobId) ? 'Job saved!' : 'Job removed.');
  }
}
