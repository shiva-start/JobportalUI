import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CandidateDashboardService } from '../../core/services/candidate-dashboard.service';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-candidate-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './candidate-shell.component.html',
})
export class CandidateShellComponent {
  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  private readonly toast = inject(ToastService);
  private readonly jobService = inject(JobService);

  readonly navItems = computed(() => [
    { label: 'Dashboard', route: '/candidate/dashboard', badge: null },
    { label: 'Profile', route: '/candidate/profile', badge: null },
    { label: 'Jobs', route: '/candidate/jobs', badge: null },
    { label: 'Applications', route: '/candidate/applications', badge: this.jobService.getAppliedJobs().length || null },
    { label: 'Saved Jobs', route: '/candidate/saved-jobs', badge: this.jobService.getSavedJobs().length || null },
    { label: 'Messages', route: '/candidate/messages', badge: this.candidate.unreadMessageCount() || null },
    { label: 'Notifications', route: '/candidate/notifications', badge: this.candidate.unreadNotificationCount() || null },
    // { label: 'Settings', route: '/candidate/settings', badge: null },
  ]);

  readonly completion = computed(() => this.candidate.profileCompletion());

  applyForFreelancer(): void {
    this.candidate.applyForFreelancer();
    this.toast.success('Freelancer request submitted for review.');
  }
}
