import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { AppLanguage, LanguageService } from '../../../core/services/language.service';

type UserRole = 'candidate' | 'employer' | 'admin';

type NavItem = {
  labelKey: string;
  route: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly languageService = inject(LanguageService);

  readonly mobileMenuOpen = signal(false);
  readonly profileMenuOpen = signal(false);
  readonly currentLanguage = this.languageService.currentLanguage;

  readonly role = computed<UserRole>(() => {
    const role = this.auth.getUserRole();
    return role === 'employer' || role === 'admin' ? role : 'candidate';
  });

  readonly menuItems = computed<Record<UserRole, NavItem[]>>(() => ({
    candidate: [
      { labelKey: 'CANDIDATE.NAV.DASHBOARD', route: '/candidate/dashboard' },
      { labelKey: 'CANDIDATE.NAV.JOBS', route: '/candidate/jobs' },
      { labelKey: 'CANDIDATE.NAV.APPLICATIONS', route: '/candidate/applications' },
      { labelKey: 'CANDIDATE.NAV.SAVED_JOBS', route: '/candidate/saved-jobs' },
      { labelKey: 'CANDIDATE.NAV.MESSAGES', route: '/candidate/messages' },
      { labelKey: 'NAV.HELP', route: '/help' },
    ],
    employer: [
      { labelKey: 'EMPLOYER.NAV.OVERVIEW', route: '/employer/dashboard' },
      { labelKey: 'EMPLOYER.NAV.POST_JOB', route: '/employer/post-job' },
      { labelKey: 'EMPLOYER.NAV.MANAGE_JOBS', route: '/employer/manage-jobs' },
      { labelKey: 'EMPLOYER.NAV.APPLICANTS', route: '/employer/candidates' },
      { labelKey: 'EMPLOYER.NAV.MESSAGES', route: '/employer/messages' },
      { labelKey: 'NAV.HELP', route: '/help' },
    ],
    admin: [
      { labelKey: 'ADMIN.NAV.DASHBOARD', route: '/admin/dashboard' },
      { labelKey: 'ADMIN.NAV.REQUESTS', route: '/admin/requests' },
      { labelKey: 'ADMIN.NAV.USERS', route: '/admin/users' },
      { labelKey: 'ADMIN.NAV.JOBS', route: '/admin/jobs' },
      { labelKey: 'ADMIN.NAV.REPORTS', route: '/admin/reports' },
      { labelKey: 'NAV.HELP', route: '/help' },
    ],
  }));

  readonly activeMenuItems = computed(() => this.menuItems()[this.role()]);
  readonly currentUser = this.auth.currentUser;
  readonly userDisplayName = computed(() =>
    this.currentUser()?.company || this.currentUser()?.name || 'JP',
  );
  readonly userSecondaryText = computed(() => this.currentUser()?.email || '');
  readonly userSecondaryTextKey = computed(() => {
    switch (this.role()) {
      case 'employer':
        return 'NAVBAR.EMPLOYER_ACCOUNT';
      case 'admin':
        return 'NAVBAR.ADMIN_ACCOUNT';
      default:
        return 'NAVBAR.CANDIDATE_ACCOUNT';
    }
  });
  readonly userInitials = computed(() => {
    const source = this.currentUser()?.name || this.currentUser()?.company || 'JP';
    return this.auth.getInitials(source);
  });
  readonly profileRoute = computed(() => {
    switch (this.role()) {
      case 'employer':
        return '/employer/company-profile';
      case 'admin':
        return '/admin/settings';
      default:
        return '/candidate/profile';
    }
  });
  readonly settingsRoute = computed(() => {
    switch (this.role()) {
      case 'employer':
        return '/employer/settings';
      case 'admin':
        return '/admin/settings';
      default:
        return '/candidate/settings';
    }
  });
  readonly isArabic = computed(() => this.currentLanguage() === 'ar');

  setLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update(open => !open);
  }

  closeMenus(): void {
    this.mobileMenuOpen.set(false);
    this.profileMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenus();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
