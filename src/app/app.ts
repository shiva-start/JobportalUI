import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription, catchError, finalize, of, timeout } from 'rxjs';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast/toast.component';
import { NgIf } from '@angular/common';
import { LanguageService } from './core/services/language.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent, NgIf],
  template: `
    <ng-container *ngIf="authReady; else authBooting">
    <ng-container *ngIf="!isAuthRoute; else authLayout">
      <app-navbar></app-navbar>
      <main class="flex-1 pt-16">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-toast-container></app-toast-container>
    </ng-container>

    <ng-template #authLayout>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-toast-container></app-toast-container>
    </ng-template>
    </ng-container>

    <ng-template #authBooting>
      <main class="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading...</main>
    </ng-template>
  `
})
export class App implements OnDestroy {
  isAuthRoute = false;
  authReady = true;
  private sub: Subscription;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private auth: AuthService
  ) {
    try {
      this.languageService.init();
    } catch {
      // Keep app shell renderable even if i18n init fails.
    }

    // Do auth bootstrap in background so UI never gets stuck on a blocking loader.
    this.auth.initializeAuth().pipe(
      timeout(10000),
      catchError(() => of(void 0)),
      finalize(() => this.authReady = true)
    ).subscribe();
    // mark auth routes when url contains common auth paths
    this.isAuthRoute = this.checkAuthUrl(this.router.url);
    this.sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.isAuthRoute = this.checkAuthUrl(this.router.url);
    });
  }

  private checkAuthUrl(url: string): boolean {
    return url.includes('/auth') || url.includes('/login') || url.includes('/register')
      || url.includes('/candidate') || url.includes('/employer') || url.includes('/admin');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
