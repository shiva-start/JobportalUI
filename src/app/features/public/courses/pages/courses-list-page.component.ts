import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { CourseCardComponent } from '../components/course-card/course-card.component';
import { CoursesService, CourseFilter } from '../services/courses.service';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-courses-list-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    RouterLink, PageHeroComponent, EmptyStateComponent,
    PaginationComponent, CourseCardComponent,
  ],
  template: `
    <!-- Hero -->
    <app-page-hero
      title="Level Up Your Skills"
      subtitle="Expertly crafted courses to help you land your next role or grow in your current one."
      badge="Courses & Learning"
      bgClass="bg-gradient-to-br from-indigo-700 to-blue-600">

      <!-- Stats -->
      <div class="mt-8 flex items-center justify-center gap-8 flex-wrap">
        @for (stat of stats; track stat.label) {
          <div class="text-center">
            <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
            <p class="text-xs text-white/70">{{ stat.label }}</p>
          </div>
        }
      </div>
    </app-page-hero>

    <!-- Content -->
    <section class="py-14 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Filter bar -->
        <div class="flex flex-wrap gap-3 items-center mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-card">
          <!-- Search -->
          <div class="flex items-center gap-2 flex-1 min-w-[180px] border border-slate-200 rounded-lg px-3 py-2">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" [(ngModel)]="filter.search" (ngModelChange)="onFilterChange()"
              placeholder="Search courses..."
              class="w-full text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none bg-transparent"/>
          </div>

          <!-- Level -->
          <select [(ngModel)]="filter.level" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <!-- Category -->
          <select [(ngModel)]="filter.category" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>

          <!-- Price -->
          <select [(ngModel)]="filter.priceType" (ngModelChange)="onFilterChange()"
            class="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Any Price</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          @if (hasActiveFilter()) {
            <button (click)="clearFilters()"
              class="ml-auto text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear
            </button>
          }
        </div>

        <!-- Result count -->
        <p class="text-sm text-slate-500 mb-6">
          Showing <span class="font-semibold text-slate-700">{{ filtered().length }}</span> courses
        </p>

        <!-- Grid -->
        @if (paginated().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of paginated(); track course.id) {
              <app-course-card [course]="course"/>
            }
          </div>
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (pageChange)="onPageChange($event)"/>
        } @else {
          <app-empty-state
            title="No courses found"
            message="Try a different search or clear your filters."
            icon="document"
            actionLabel="Clear Filters"
            (action)="clearFilters()"/>
        }

        <!-- CTA Banner -->
        <div class="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h3 class="text-xl font-bold text-white mb-2">Can't find the right course?</h3>
          <p class="text-white/80 text-sm mb-5">Tell us what you'd like to learn and we'll notify you when it's available.</p>
          <a routerLink="/help"
             class="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm">
            Request a Course
          </a>
        </div>
      </div>
    </section>
  `
})
export class CoursesListPageComponent {
  private service = inject(CoursesService);

  filter: CourseFilter = { search: '', level: '', category: '', priceType: '' };
  currentPage = signal(1);
  categories = this.service.getCategories();

  filtered = computed(() => this.service.getFiltered(this.filter));
  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  hasActiveFilter = computed(() => Object.values(this.filter).some(v => v !== ''));

  stats = [
    { value: '50+', label: 'Courses' },
    { value: '30k+', label: 'Students' },
    { value: '4.8★', label: 'Avg Rating' },
    { value: '100%', label: 'Certificates' },
  ];

  onFilterChange(): void { this.currentPage.set(1); }
  onPageChange(page: number): void { this.currentPage.set(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  clearFilters(): void {
    this.filter = { search: '', level: '', category: '', priceType: '' };
    this.currentPage.set(1);
  }
}
