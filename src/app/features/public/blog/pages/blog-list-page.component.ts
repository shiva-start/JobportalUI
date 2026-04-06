import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { BlogCardComponent } from '../components/blog-card/blog-card.component';
import { BlogFeaturedPostComponent } from '../components/blog-featured-post/blog-featured-post.component';
import { BlogCategoryFilterComponent } from '../components/blog-category-filter/blog-category-filter.component';
import { BlogService, BlogFilter } from '../services/blog.service';
import { BlogCategory } from '../../../../models';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-blog-list-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    PageHeroComponent, SectionHeaderComponent, EmptyStateComponent,
    PaginationComponent, BlogCardComponent, BlogFeaturedPostComponent,
    BlogCategoryFilterComponent,
  ],
  template: `
    <!-- Hero -->
    <app-page-hero
      title="The JobPortal Blog"
      subtitle="Career advice, tech insights, and industry news to help you grow professionally."
      badge="Articles & Insights"
      bgClass="bg-gradient-to-br from-slate-900 to-blue-800">

      <!-- Search -->
      <div class="mt-8 max-w-xl mx-auto">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="filter.search" (ngModelChange)="onSearchChange()"
            placeholder="Search articles..."
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"/>
        </div>
      </div>
    </app-page-hero>

    <div class="bg-gray-50 min-h-screen">

      <!-- Featured Post -->
      @if (featuredPost() && !filter.category && !filter.search) {
        <section class="pt-14 pb-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-6">
              <app-section-header label="Editor's Pick" title="Featured Article" alignment="left"/>
            </div>
            <app-blog-featured-post [post]="featuredPost()!"/>
          </div>
        </section>
      }

      <!-- Posts grid -->
      <section class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <!-- Category filter + result count row -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <app-blog-category-filter
              [categories]="categories"
              [active]="filter.category"
              (select)="onCategoryChange($event)"/>
            <p class="text-sm text-slate-500 flex-shrink-0">
              <span class="font-semibold text-slate-700">{{ filtered().length }}</span> articles
            </p>
          </div>

          <!-- Grid -->
          @if (paginated().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (post of paginated(); track post.id) {
                <app-blog-card [post]="post"/>
              }
            </div>
            <app-pagination
              [currentPage]="currentPage()"
              [totalPages]="totalPages()"
              (pageChange)="onPageChange($event)"/>
          } @else {
            <app-empty-state
              title="No articles found"
              message="Try a different category or clear your search."
              actionLabel="Show All Articles"
              (action)="clearFilters()"/>
          }
        </div>
      </section>

      <!-- Newsletter CTA -->
      <section class="pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-2xl p-8 md:p-12 text-center">
            <h3 class="text-2xl font-bold text-white mb-2">Stay in the Loop</h3>
            <p class="text-white/80 text-sm mb-6 max-w-md mx-auto">Get the latest career tips, job market insights, and tech articles delivered to your inbox weekly.</p>
            <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com"
                class="flex-1 px-4 py-3 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"/>
              <button class="px-6 py-3 bg-white text-blue-600 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-all duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class BlogListPageComponent {
  private blogService = inject(BlogService);

  filter: BlogFilter = { category: '', search: '' };
  currentPage = signal(1);
  categories = this.blogService.getCategories();
  featuredPost = computed(() => this.blogService.getFeatured());

  filtered = computed(() => this.blogService.getFiltered(this.filter));
  totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  onCategoryChange(cat: BlogCategory | ''): void {
    this.filter = { ...this.filter, category: cat };
    this.currentPage.set(1);
  }

  onSearchChange(): void {
    this.filter = { ...this.filter };
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filter = { category: '', search: '' };
    this.currentPage.set(1);
  }
}
