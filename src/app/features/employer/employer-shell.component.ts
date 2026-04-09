import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-employer-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div [dir]="languageService.isRtl() ? 'rtl' : 'ltr'" class="min-h-screen bg-slate-50 pt-16">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class EmployerShellComponent {
  readonly languageService = inject(LanguageService);
}
