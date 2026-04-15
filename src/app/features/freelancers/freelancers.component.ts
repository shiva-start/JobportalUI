import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FreelancerCardComponent } from '../../shared/components/freelancer-card/freelancer-card.component';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { FreelancerService } from '../../core/services/freelancer.service';

@Component({
  selector: 'app-freelancers',
  standalone: true,
  imports: [CommonModule, FormsModule, FreelancerCardComponent, PageHeroComponent, TranslatePipe],
  template: `
    <app-page-hero
      [title]="'FREELANCERS.PAGE.TITLE' | translate"
      [subtitle]="'FREELANCERS.PAGE.SUBTITLE' | translate"
      [badge]="'FREELANCERS.PAGE.BADGE' | translate"
      bgClass="bg-gradient-to-br from-teal-700 to-blue-700">

      <div class="mt-8 max-w-3xl mx-auto">
        <div class="flex flex-col gap-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row">
          <div class="flex flex-1 items-center gap-2 px-3">
            <svg class="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" [placeholder]="'FREELANCERS.FILTER.SEARCH_PLACEHOLDER' | translate" [(ngModel)]="keyword"
              class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none" />
          </div>
          <div class="flex items-center gap-2 px-3 sm:w-56">
            <svg class="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            <input type="text" [placeholder]="'FREELANCERS.FILTER.LOCATION_PLACEHOLDER' | translate" [(ngModel)]="location"
              class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none" />
          </div>
          <button class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700">
            {{ 'COMMON.SEARCH' | translate }}
          </button>
        </div>
      </div>
    </app-page-hero>

    <section class="min-h-screen bg-gray-50 py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{{ 'FREELANCERS.FILTER.LABEL' | translate }}</span>

          <select [(ngModel)]="experience"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'FREELANCERS.FILTER.EXPERIENCE_LEVEL' | translate }}</option>
            <option>{{ 'FREELANCERS.FILTER.EXPERIENCE_OPTIONS.BEGINNER' | translate }}</option>
            <option>{{ 'FREELANCERS.FILTER.EXPERIENCE_OPTIONS.INTERMEDIATE' | translate }}</option>
            <option>{{ 'FREELANCERS.FILTER.EXPERIENCE_OPTIONS.EXPERT' | translate }}</option>
          </select>

          <select [(ngModel)]="availability"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'FREELANCERS.FILTER.AVAILABILITY' | translate }}</option>
            <option value="available">{{ 'FREELANCERS.FILTER.AVAILABILITY_OPTIONS.AVAILABLE_NOW' | translate }}</option>
            <option value="part-time">{{ 'FREELANCERS.FILTER.AVAILABILITY_OPTIONS.PART_TIME' | translate }}</option>
            <option value="contract">{{ 'FREELANCERS.FILTER.AVAILABILITY_OPTIONS.CONTRACT' | translate }}</option>
          </select>

          <p class="ml-auto text-sm text-slate-500">
            {{ 'FREELANCERS.FILTER.RESULTS' | translate:{ count: filteredFreelancers.length } }}
          </p>

          @if (hasActiveFilters()) {
            <button (click)="clearFilters()"
              class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ 'FREELANCERS.FILTER.CLEAR' | translate }}
            </button>
          }
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (f of filteredFreelancers; track f.id) {
          <app-freelancer-card [freelancer]="f"></app-freelancer-card>
        } @empty {
          <p class="col-span-4 text-center text-gray-400 py-12">{{ 'FREELANCERS.EMPTY' | translate }}</p>
        }
      </div>
      </div>
    </section>
  `
})
export class FreelancersComponent {
  private fs = inject(FreelancerService);
  private readonly translate = inject(TranslateService);
  freelancers = this.fs.list();

  // simple search state
  keyword = '';
  experience = '';
  location = '';
  availability = '';

  hasActiveFilters(): boolean {
    return !!(this.keyword || this.experience || this.location || this.availability);
  }

  clearFilters(): void {
    this.keyword = '';
    this.experience = '';
    this.location = '';
    this.availability = '';
  }

  get approvedFreelancers() {
    return this.freelancers.filter(f => f.status === 'approved');
  }

  get filteredFreelancers() {
    return this.approvedFreelancers.filter(f => {
      const kw = this.keyword.toLowerCase();
      if (kw) {
        const searchableRole = f.roleKey ? this.translate.instant(f.roleKey) : f.role;
        const searchableName = f.nameKey ? this.translate.instant(f.nameKey) : f.name;
        const searchableDescription = f.descriptionKey ? this.translate.instant(f.descriptionKey) : f.description;
        const searchableSkills = (f.skillKeys?.length
          ? f.skillKeys.map(key => this.translate.instant(key))
          : f.skills || []).join(' ');

        const haystack = [searchableRole, searchableName, searchableDescription, searchableSkills]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(kw)) return false;
      }
      if (this.experience) {
        // no experience on mock items; skip
      }
      if (this.location) {
        if (!(((f as any).location||'').toLowerCase().includes(this.location.toLowerCase()))) return false;
      }
      if (this.availability) {
        // no availability field on mock items; skip
      }
      return true;
    });
  }
}
