import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type NavLink = {
  label: string;
  route: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly menuOpen = signal(false);
  readonly isResourcesOpen = signal(false);
  readonly isMobileResourcesOpen = signal(false);
  readonly scrolled = signal(false);
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());

  readonly primaryLinks: NavLink[] = [
    { label: 'Jobseekers', route: '/jobs' },
    { label: 'Companies', route: '/companies' },
    { label: 'Freelancers', route: '/freelancers' },
    { label: 'Help', route: '/help' },
  ];

  readonly resourceLinks: NavLink[] = [
    { label: 'Blog', route: '/blog' },
    { label: 'Courses', route: '/courses' },
    { label: 'Internships', route: '/internships' },
  ];

  goToHome(): void {
    this.closeAllMenus();
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
    if (!this.menuOpen()) {
      this.isMobileResourcesOpen.set(false);
    }
  }

  toggleMobileResources(): void {
    this.isMobileResourcesOpen.update(value => !value);
  }

  openResourcesMenu(): void {
    this.isResourcesOpen.set(true);
  }

  closeResourcesMenu(): void {
    this.isResourcesOpen.set(false);
  }

  closeAllMenus(): void {
    this.menuOpen.set(false);
    this.isResourcesOpen.set(false);
    this.isMobileResourcesOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('nav')) {
      this.closeAllMenus();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }
}
