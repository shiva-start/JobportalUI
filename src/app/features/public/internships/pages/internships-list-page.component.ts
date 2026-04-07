import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { InternshipCardComponent } from '../components/internship-card/internship-card.component';
import { InternshipsService, InternshipFilter } from '../services/internships.service';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-internships-list-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TranslatePipe,
    PageHeroComponent, EmptyStateComponent,
    PaginationComponent, InternshipCardComponent,
  ],
  template: `
    <app-page-hero
      [title]="'INTERNSHIPS.LIST.TITLE' | translate"
      [subtitle]="'INTERNSHIPS.LIST.SUBTITLE' | translate"
      [badge]="'INTERNSHIPS.LIST.BADGE' | translate"
      bgClass="bg-gradient-to-br from-teal-700 to-blue-700">
      <div class="mt-8 max-w-2xl mx-auto">
        <div class="flex gap-2 bg-white rounded-xl p-2 shadow-xl">
          <div class="flex-1 flex items-center gap-2 px-3">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" [(ngModel)]="filter.search" (ngModelChange)="onFilterChange()"
              [placeholder]="'INTERNSHIPS.FILTER.SEARCH_PLACEHOLDER' | translate"
              class="w-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none bg-transparent"/>
          </div>
          <button class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200">
            {{ 'COMMON.SEARCH' | translate }}
          </button>
        </div>
      </div>
    </app-page-hero>

    <section class="py-14 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap gap-3 items-center mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-card">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">{{ 'INTERNSHIPS.FILTER.LABEL' | translate }}</span>

          <select [(ngModel)]="filter.locationType" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'INTERNSHIPS.FILTER.ALL_LOCATIONS' | translate }}</option>
            <option value="Remote">{{ 'INTERNSHIPS.FILTER.LOCATION_OPTIONS.REMOTE' | translate }}</option>
            <option value="Onsite">{{ 'INTERNSHIPS.FILTER.LOCATION_OPTIONS.ONSITE' | translate }}</option>
            <option value="Hybrid">{{ 'INTERNSHIPS.FILTER.LOCATION_OPTIONS.HYBRID' | translate }}</option>
          </select>

          <select [(ngModel)]="filter.duration" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'INTERNSHIPS.FILTER.ANY_DURATION' | translate }}</option>
            <option value="3 months">{{ 'INTERNSHIPS.FILTER.DURATION_OPTIONS.THREE_MONTHS' | translate }}</option>
            <option value="6 months">{{ 'INTERNSHIPS.FILTER.DURATION_OPTIONS.SIX_MONTHS' | translate }}</option>
          </select>

          <select [(ngModel)]="filter.stipend" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'INTERNSHIPS.FILTER.ANY_STIPEND' | translate }}</option>
            <option value="paid">{{ 'INTERNSHIPS.FILTER.STIPEND_OPTIONS.PAID_ONLY' | translate }}</option>
            <option value="unpaid">{{ 'INTERNSHIPS.FILTER.STIPEND_OPTIONS.UNPAID' | translate }}</option>
          </select>

          <select [(ngModel)]="filter.category" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'INTERNSHIPS.FILTER.ALL_CATEGORIES' | translate }}</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ categoryKey(cat) | translate }}</option>
            }
          </select>

          @if (hasActiveFilter()) {
            <button (click)="clearFilters()"
              class="ml-auto text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ 'INTERNSHIPS.FILTER.CLEAR' | translate }}
            </button>
          }
        </div>

        <div class="flex items-center justify-between mb-6">
          <p class="text-sm text-slate-500">
            {{ 'INTERNSHIPS.LIST.RESULTS' | translate:{ count: filtered().length } }}
          </p>
        </div>

        @if (paginated().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (internship of paginated(); track internship.id) {
              <app-internship-card [internship]="internship"/>
            }
          </div>
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (pageChange)="onPageChange($event)"/>
        } @else {
          <app-empty-state
            [title]="'INTERNSHIPS.EMPTY.TITLE' | translate"
            [message]="'INTERNSHIPS.EMPTY.MESSAGE' | translate"
            [actionLabel]="'INTERNSHIPS.EMPTY.ACTION' | translate"
            (action)="clearFilters()"/>
        }
      </div>
    </section>
  `
})
export class InternshipsListPageComponent {
  private service = inject(InternshipsService);

  filter: InternshipFilter = { search: '', locationType: '', duration: '', stipend: '', category: '' };
  currentPage = signal(1);
  categories = this.service.getCategories();

  filtered = computed(() => this.service.getFiltered(this.filter));
  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  hasActiveFilter = computed(() => Object.values(this.filter).some(v => v !== ''));

  categoryKey(category: string): string {
    return `INTERNSHIPS.CATEGORIES.${category.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  }

  onFilterChange(): void { this.currentPage.set(1); }
  onPageChange(page: number): void { this.currentPage.set(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  clearFilters(): void {
    this.filter = { search: '', locationType: '', duration: '', stipend: '', category: '' };
    this.currentPage.set(1);
  }
}
