import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { CandidateDashboardService } from '../../core/services/candidate-dashboard.service';
import { JobService } from '../../core/services/job.service';
import { LanguageService } from '../../core/services/language.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-candidate-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe, NavbarComponent],
  templateUrl: './candidate-shell.component.html',
})
export class CandidateShellComponent {
  private readonly userNameKeys: Record<string, string> = {
    'Ahmed Hassan': 'CANDIDATE.USER.NAME.AHMED_HASSAN',
  };

  private readonly userTitleKeys: Record<string, string> = {
    'Senior Frontend Developer': 'JOBS.CARD.TITLES.SENIOR_FRONTEND_DEVELOPER',
  };

  private readonly userLocationKeys: Record<string, string> = {
    'Cairo, Egypt': 'JOBS.CARD.LOCATIONS.CAIRO_EGYPT',
  };

  readonly auth = inject(AuthService);
  readonly candidate = inject(CandidateDashboardService);
  readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);
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
  readonly currentUserNameKey = computed(() => this.getTranslationKey(this.auth.currentUser()?.name, this.userNameKeys));
  readonly currentUserTitleKey = computed(() => this.getTranslationKey(this.candidate.profile().headline, this.userTitleKeys));
  readonly currentUserLocationKey = computed(() => this.getTranslationKey(this.candidate.profile().location, this.userLocationKeys));
  readonly isArabic = computed(() => this.languageService.currentLanguage() === 'ar');

  applyForFreelancer(): void {
    this.candidate.applyForFreelancer();
    this.toast.success(this.translate.instant('CANDIDATE.SHELL.FREELANCER_REQUEST_SUBMITTED'));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private getTranslationKey(value: string | undefined, dictionary: Record<string, string>): string | null {
    if (!value) {
      return null;
    }

    return dictionary[value] ?? null;
  }
}
