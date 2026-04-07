import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Job } from '../../../models';
import { BadgeComponent } from '../badge/badge.component';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink, CommonModule, BadgeComponent, TranslatePipe],
  template: `
    <div [class]="cardClasses"
      class="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full hover:-translate-y-1 hover:scale-[1.02]">

      <!-- Top accent bar -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>

      <!-- Content wrapper with padding -->
      <div class="flex flex-col h-full p-6 space-y-4">

        <!-- Featured ribbon -->
        @if (job.featured) {
          <div class="absolute top-4 right-4 z-10">
            <app-badge variant="indigo">{{ 'JOBS.CARD.FEATURED' | translate }}</app-badge>
          </div>
        }

        <!-- Company info -->
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
               [class]="logoColor">
            {{ job.companyLogo || job.company.slice(0,2).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ job.company }}</p>
            <p class="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ job.location }}
            </p>
          </div>
        </div>

        <!-- Job title -->
        <a [routerLink]="['/jobs', job.id]"
           class="block text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
          {{ job.title }}
        </a>

        <!-- Meta section -->
        <div class="space-y-2.5">
          <div class="flex items-center gap-2 flex-wrap">
            <app-badge [variant]="typeVariant" class="text-xs bg-blue-50 hover:bg-blue-100 transition-colors duration-200">{{ ('JOBS.TYPES.' + typeKey(job.type)) | translate }}</app-badge>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs text-slate-600 font-medium">{{ ('JOBS.LEVELS.' + levelKey(job.experienceLevel)) | translate }}</span>
          </div>
          @if (job.salary) {
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
              <span class="text-sm font-semibold text-green-600">{{ job.salary }}</span>
            </div>
          }
        </div>

        <!-- Skills section -->
        @if (job.skills && job.skills.length) {
          <div class="flex flex-wrap gap-1.5">
            @for (skill of job.skills.slice(0,2); track skill) {
              <span class="text-xs text-slate-600 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-md hover:bg-slate-100 hover:border-slate-200 transition-colors duration-200">{{ skill }}</span>
            }
            @if (job.skills.length > 2) {
              <span class="text-xs text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-md">+{{ job.skills.length - 2 }}</span>
            }
          </div>
        }

        <!-- Spacer -->
        <div class="flex-grow"></div>

        <!-- Footer section with border -->
        <div class="pt-4 border-t border-slate-100">
          <div class="flex items-center justify-between gap-3">
            <div class="text-xs text-slate-500 font-medium">
              {{ timeAgo(job.postedAt) }}
            </div>

            <div class="flex items-center gap-2">
              <a [routerLink]="['/jobs', job.id]"
                 class="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5">
                {{ 'JOBS.CARD.VIEW_DETAILS' | translate }}
                <svg class="w-3.5 h-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <button (click)="onSaveToggle($event)"
                class="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 group/save"
                [title]="saved ? ('JOBS.CARD.REMOVE_SAVED' | translate) : ('JOBS.CARD.SAVE' | translate)">
                @if (saved) {
                  <svg class="w-5 h-5 text-blue-600 fill-current transition-transform duration-200 group-hover/save:scale-110" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                } @else {
                  <svg class="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors duration-200 group-hover/save:scale-110 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobCardComponent {
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  @Input({ required: true }) job!: Job;
  @Input() saved = false;
  @Input() compact = false;
  @Output() saveToggle = new EventEmitter<string>();

  get cardClasses(): string {
    return this.compact ? 'h-full' : '';
  }

  get logoColor(): string {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-teal-500 to-teal-700',
      'bg-gradient-to-br from-orange-500 to-orange-700',
      'bg-gradient-to-br from-green-500 to-green-700',
    ];
    const index = this.job.id.charCodeAt(0) % colors.length;
    return colors[index];
  }

  get typeVariant(): 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gray' {
    const map: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gray'> = {
      'full-time': 'blue',
      'part-time': 'purple',
      'contract': 'orange',
      'remote': 'green',
      'internship': 'teal',
    };
    return map[this.job.type] || 'gray';
  }

  onSaveToggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.saveToggle.emit(this.job.id);
  }

  typeKey(type: string): string {
    return type.toUpperCase().replace(/-/g, '_');
  }

  levelKey(level: string): string {
    return level.toUpperCase();
  }

  timeAgo(dateStr: string): string {
    this.languageService.currentLanguage();

    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return this.translate.instant('COMMON.TIME.TODAY');
    if (diffDays === 1) return this.translate.instant('COMMON.TIME.DAY_AGO', { count: 1 });
    if (diffDays < 7) return this.translate.instant('COMMON.TIME.DAYS_AGO', { count: diffDays });
    if (diffDays < 30) return this.translate.instant('COMMON.TIME.WEEKS_AGO', { count: Math.floor(diffDays / 7) });
    return this.translate.instant('COMMON.TIME.MONTHS_AGO', { count: Math.floor(diffDays / 30) });
  }
}
