import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FreelancerProfile } from '../../../models';

@Component({
  selector: 'app-freelancer-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full hover:-translate-y-1">

      <!-- Avatar Header -->
      <div class="flex items-center gap-4 mb-4">
        <img [src]="freelancerAvatar" alt="{{ freelancer.name || '' }}" class="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0 transition group-hover:ring-blue-300" />
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-semibold text-slate-800 truncate">{{ freelancer.nameKey ? (freelancer.nameKey | translate) : freelancer.name }}</h3>
          <p class="text-sm text-slate-500 truncate mt-0.5">{{ roleTranslateKey ? (roleTranslateKey | translate) : freelancer.role }}</p>
        </div>
      </div>

      <!-- Badge -->
      @if (freelancer.type || freelancer.typeKey) {
        <div class="mb-3">
          <span class="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">{{ typeTranslateKey ? (typeTranslateKey | translate) : freelancer.type }}</span>
        </div>
      }

      <!-- Description -->
      <p class="text-sm text-slate-600 leading-relaxed mb-4">{{ descriptionTranslateKey ? (descriptionTranslateKey | translate) : freelancer.description }}</p>

      <!-- Skills -->
      <div class="flex flex-wrap gap-2 mb-6">
        @for (skill of topSkills; track skill) {
          <span class="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
            {{ skill.key ? (skill.key | translate) : skill.value }}
          </span>
        }
      </div>

      <!-- Spacer -->
      <div class="flex-grow"></div>

      <!-- Action Button (Request via Admin) -->
      <a [routerLink]="['/freelancer-request']" [queryParams]="{ freelancerId: freelancer.id }" class="w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all duration-200 group-hover:shadow-sm">
        {{ 'FREELANCERS.CARD.REQUEST' | translate }}
      </a>
    </div>
  `
})
export class FreelancerCardComponent {
  private readonly roleKeyMap: Record<string, string> = {
    'Frontend Developer': 'FREELANCERS.CARD.ROLES.FRONTEND_DEVELOPER',
    '.NET Developer': 'FREELANCERS.CARD.ROLES.DOTNET_DEVELOPER',
    'UX/UI Designer': 'FREELANCERS.CARD.ROLES.UX_UI_DESIGNER',
    'Full-Stack Developer': 'FREELANCERS.CARD.ROLES.FULL_STACK_DEVELOPER',
    'Data Analyst': 'FREELANCERS.CARD.ROLES.DATA_ANALYST',
    'Mobile Developer': 'FREELANCERS.CARD.ROLES.MOBILE_DEVELOPER'
  };

  private readonly typeKeyMap: Record<string, string> = {
    Freelancer: 'FREELANCERS.CARD.TYPES.FREELANCER'
  };

  private readonly descriptionKeyMap: Record<string, string> = {
    'Building responsive, accessible UIs with modern frameworks.': 'FREELANCERS.CARD.DESCRIPTIONS.FRONTEND_DEVELOPER',
    'Robust API development and scalable backend solutions.': 'FREELANCERS.CARD.DESCRIPTIONS.DOTNET_DEVELOPER',
    'Designing intuitive product experiences that delight users.': 'FREELANCERS.CARD.DESCRIPTIONS.UX_UI_DESIGNER',
    'End-to-end web applications from database to deployment.': 'FREELANCERS.CARD.DESCRIPTIONS.FULL_STACK_DEVELOPER',
    'Turning raw data into actionable business insights.': 'FREELANCERS.CARD.DESCRIPTIONS.DATA_ANALYST',
    'Cross-platform mobile apps for iOS and Android.': 'FREELANCERS.CARD.DESCRIPTIONS.MOBILE_DEVELOPER'
  };

  @Input() freelancer: FreelancerProfile = {
    id: '',
    name: '',
    role: '',
    type: '',
    status: 'pending',
    skills: [],
    description: ''
  };

  get roleTranslateKey(): string | null {
    if (this.freelancer.roleKey) {
      return this.freelancer.roleKey;
    }

    return this.roleKeyMap[this.freelancer.role] ?? null;
  }

  get typeTranslateKey(): string | null {
    if (this.freelancer.typeKey) {
      return this.freelancer.typeKey;
    }

    return this.typeKeyMap[this.freelancer.type] ?? null;
  }

  get descriptionTranslateKey(): string | null {
    if (this.freelancer.descriptionKey) {
      return this.freelancer.descriptionKey;
    }

    return this.descriptionKeyMap[this.freelancer.description] ?? null;
  }

  get freelancerAvatar(): string {
    const nameForAvatar = this.freelancer.name || this.freelancer.id || '?';
    const avatar = (this.freelancer as unknown as { avatar?: string }).avatar;
    return avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&size=56&background=dbeafe&color=1d4ed8`;
  }

  get topSkills(): Array<{ value: string; key?: string }> {
    const skills = this.freelancer.skills ?? [];
    const skillKeys = this.freelancer.skillKeys ?? [];

    return skills.slice(0, 3).map((value, index) => ({
      value,
      key: skillKeys[index]
    }));
  }
}
