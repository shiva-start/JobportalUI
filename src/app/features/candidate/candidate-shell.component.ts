import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { CandidateDashboardService } from '../../core/services/candidate-dashboard.service';
import { JobService } from '../../core/services/job.service';
import { LanguageService } from '../../core/services/language.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-candidate-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './candidate-shell.component.html',
})
export class CandidateShellComponent {
  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  readonly languageService = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly jobService = inject(JobService);
  private readonly router = inject(Router);

  readonly navItems = computed(() => [
    { labelKey: 'CANDIDATE.NAV.DASHBOARD', route: '/candidate/dashboard', badge: null },
    { labelKey: 'CANDIDATE.NAV.PROFILE', route: '/candidate/profile', badge: null },
    { labelKey: 'CANDIDATE.NAV.JOBS', route: '/candidate/jobs', badge: null },
    { labelKey: 'CANDIDATE.NAV.APPLICATIONS', route: '/candidate/applications', badge: this.jobService.getAppliedJobs().length || null },
    { labelKey: 'CANDIDATE.NAV.SAVED_JOBS', route: '/candidate/saved-jobs', badge: this.jobService.getSavedJobs().length || null },
    { labelKey: 'CANDIDATE.NAV.MESSAGES', route: '/candidate/messages', badge: this.candidate.unreadMessageCount() || null },
    { labelKey: 'CANDIDATE.NAV.NOTIFICATIONS', route: '/candidate/notifications', badge: this.candidate.unreadNotificationCount() || null },
  ]);

  readonly completion = computed(() => this.candidate.profileCompletion());

  applyForFreelancer(): void {
    this.candidate.applyForFreelancer();
    this.toast.success('Freelancer request submitted for review.');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
