import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-freelancer-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full hover:-translate-y-1">
      <div class="flex items-center gap-4 mb-4">
        <img [src]="freelancer.avatar || 'https://ui-avatars.com/api/?name=' + (freelancer.name || '?') + '&size=56&background=dbeafe&color=1d4ed8'" alt="{{ freelancer.name }}" class="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0 transition group-hover:ring-blue-300" />
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-semibold text-slate-800 truncate">{{ freelancer.name }}</h3>
          <p class="text-sm text-slate-500 truncate mt-0.5">{{ resolvedRoleKey | translate }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div class="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
          <p class="text-slate-400">Experience</p>
          <p class="text-slate-700 font-medium truncate">{{ freelancer.experience || 'N/A' }}</p>
        </div>
        <div class="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
          <p class="text-slate-400">Rating</p>
          <p class="text-slate-700 font-medium">{{ freelancer.rating || '4.8' }} / 5</p>
        </div>
      </div>

      <p class="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">{{ resolvedDescriptionKey | translate }}</p>

      <div class="flex flex-wrap gap-2 mb-6">
        @for (skill of topSkills; track skill) {
          <span class="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
            {{ skill }}
          </span>
        }
      </div>

      <div class="flex-grow"></div>

      <button type="button" (click)="viewProfile()" class="w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all duration-200 group-hover:shadow-sm">
        View Profile
      </button>
    </div>
  `
})
export class FreelancerCardComponent {
  @Input() freelancer: any = {};
  constructor(
    private readonly auth: AuthService,
    private readonly toastService: ToastService,
    private readonly translate: TranslateService,
    private readonly router: Router
  ) {}

  private readonly roleKeyMap: Record<string, string> = {
    'Frontend Developer': 'FREELANCERS.CARD.ROLES.FRONTEND_DEVELOPER',
    '.NET Developer': 'FREELANCERS.CARD.ROLES.DOTNET_DEVELOPER',
    'UX/UI Designer': 'FREELANCERS.CARD.ROLES.UX_UI_DESIGNER',
    'Full-Stack Developer': 'FREELANCERS.CARD.ROLES.FULL_STACK_DEVELOPER',
    'Data Analyst': 'FREELANCERS.CARD.ROLES.DATA_ANALYST',
    'Mobile Developer': 'FREELANCERS.CARD.ROLES.MOBILE_DEVELOPER'
  };

  private readonly descriptionKeyMap: Record<string, string> = {
    'Building responsive, accessible UIs with modern frameworks.': 'FREELANCERS.CARD.DESCRIPTIONS.FRONTEND_DEVELOPER',
    'Robust API development and scalable backend solutions.': 'FREELANCERS.CARD.DESCRIPTIONS.DOTNET_DEVELOPER',
    'Designing intuitive product experiences that delight users.': 'FREELANCERS.CARD.DESCRIPTIONS.UX_UI_DESIGNER',
    'End-to-end web applications from database to deployment.': 'FREELANCERS.CARD.DESCRIPTIONS.FULL_STACK_DEVELOPER',
    'Turning raw data into actionable business insights.': 'FREELANCERS.CARD.DESCRIPTIONS.DATA_ANALYST',
    'Cross-platform mobile apps for iOS and Android.': 'FREELANCERS.CARD.DESCRIPTIONS.MOBILE_DEVELOPER'
  };

  get resolvedRoleKey(): string {
    return this.roleKeyMap[this.freelancer?.role] ?? this.freelancer?.role ?? 'FREELANCERS.CARD.ROLES.UNKNOWN';
  }

  get resolvedDescriptionKey(): string {
    return this.descriptionKeyMap[this.freelancer?.description] ?? this.freelancer?.description ?? 'FREELANCERS.CARD.DESCRIPTIONS.UNKNOWN';
  }

  get topSkills() {
    return this.freelancer?.skills?.slice(0, 4) || [];
  }

  viewProfile(): void {
    if (!this.auth.isAuthenticated()) {
      this.toastService.info(this.translate.instant('JOBS.DETAIL.TOASTS.LOGIN_REQUIRED'));
      void this.router.navigate(['/login']);
      return;
    }

    void this.router.navigate(['/freelancer-request'], {
      queryParams: { freelancerId: this.freelancer?.id }
    });
  }
}
