import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast/toast.component';
import { NgIf } from '@angular/common';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastContainerComponent, NgIf],
  template: `
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
  `
})
export class App implements OnDestroy {
  isAuthRoute = false;
  private sub: Subscription;

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {
    this.languageService.init();
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
