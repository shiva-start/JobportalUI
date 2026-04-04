import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

type UserRole = 'candidate' | 'employer' | 'admin';

type MenuItem = {
  label: string;
  route: string;
  roles: UserRole[];
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  menuOpen = signal(false);
  profileMenuOpen = signal(false);
  scrolled = signal(false);
  isLoggedIn = computed(() => this.auth.isLoggedIn());
  userRole = computed<UserRole | null>(() => this.auth.getUserRole());

  menuItems: MenuItem[] = [
    { label: 'Find Jobs', route: '/jobs', roles: ['candidate'] },
    { label: 'Applications', route: '/candidate/applications', roles: ['candidate'] },
    { label: 'Saved Jobs', route: '/candidate/saved-jobs', roles: ['candidate'] },
    { label: 'Messages', route: '/candidate/messages', roles: ['candidate'] },
    { label: 'Companies', route: '/companies', roles: ['candidate'] },
    { label: 'Dashboard', route: '/employer/dashboard', roles: ['employer'] },
    { label: 'Post Job', route: '/employer/post-job', roles: ['employer'] },
    { label: 'Manage Jobs', route: '/employer/manage-jobs', roles: ['employer'] },
    { label: 'Candidates', route: '/employer/candidates', roles: ['employer'] },
    { label: 'Freelancers', route: '/freelancers', roles: ['employer'] },
    { label: 'Messages', route: '/employer/messages', roles: ['employer'] },
    { label: 'Dashboard', route: '/admin/dashboard', roles: ['admin'] },
    { label: 'Freelancer Requests', route: '/admin/requests', roles: ['admin'] },
    { label: 'Users', route: '/admin/users', roles: ['admin'] },
    { label: 'Jobs', route: '/admin/jobs', roles: ['admin'] },
    { label: 'Reports', route: '/admin/reports', roles: ['admin'] },
    { label: 'Settings', route: '/admin/settings', roles: ['admin'] },
  ];

  readonly filteredMenu = computed(() => {
    const role = this.userRole();
    if (!role) {
      return [
        { label: 'Job Seekers', route: '/jobs' },
        { label: 'Employers', route: '/companies' },
        { label: 'Freelancers', route: '/freelancers' },
      ];
    }
    return this.menuItems.filter(item => item.roles.includes(role));
  });

  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void {
    this.menuOpen.set(false);
    this.profileMenuOpen.set(false);
  }
  toggleProfileMenu(): void { this.profileMenuOpen.update(v => !v); }

  goToHome(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    if (this.userRole() === 'candidate') {
      this.router.navigate(['/candidate/dashboard']);
      return;
    }

    if (this.userRole() === 'employer') {
      this.router.navigate(['/employer/dashboard']);
      return;
    }

    if (this.userRole() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  goToProfile(): void {
    this.closeMenu();
    if (this.userRole() === 'candidate') {
      this.router.navigate(['/candidate/profile']);
      return;
    }
    if (this.userRole() === 'employer') {
      this.router.navigate(['/employer/company-profile']);
      return;
    }
    if (this.userRole() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    this.goToHome();
  }

  goToSettings(): void {
    this.closeMenu();
    if (this.userRole() === 'candidate') {
      this.router.navigate(['/candidate/settings']);
      return;
    }
    if (this.userRole() === 'employer') {
      this.router.navigate(['/employer/settings']);
      return;
    }
    if (this.userRole() === 'admin') {
      this.router.navigate(['/admin/settings']);
      return;
    }
    this.goToHome();
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('nav')) {
      this.menuOpen.set(false);
      this.profileMenuOpen.set(false);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }
}
