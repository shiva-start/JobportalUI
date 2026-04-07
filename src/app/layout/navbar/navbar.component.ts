import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService, AppLanguage } from '../../core/services/language.service';

type NavLink = {
  labelKey: string;
  route: string;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly languageService = inject(LanguageService);

  readonly menuOpen = signal(false);
  readonly isResourcesOpen = signal(false);
  readonly isMobileResourcesOpen = signal(false);
  readonly scrolled = signal(false);
  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  readonly currentLanguage = this.languageService.currentLanguage;
  readonly isRtl = this.languageService.isRtl;

  readonly primaryLinks: NavLink[] = [
    { labelKey: 'NAV.JOBSEEKERS', route: '/jobs' },
    { labelKey: 'NAV.COMPANIES', route: '/companies' },
    { labelKey: 'NAV.FREELANCERS', route: '/freelancers' },
    { labelKey: 'NAV.HELP', route: '/help' },
  ];

  readonly resourceLinks: NavLink[] = [
    { labelKey: 'NAV.BLOG', route: '/blog' },
    { labelKey: 'NAV.COURSES', route: '/courses' },
    { labelKey: 'NAV.INTERNSHIPS', route: '/internships' },
  ];

  setLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

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
