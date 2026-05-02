import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { CompaniesService } from '../../core/services/companies.service';
import { Company } from '../../core/models/company.model';
import { JobsService } from '../../core/services/jobs.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeroComponent, TranslatePipe],
  template: `
    <app-page-hero
      [title]="'COMPANIES.PAGE.TITLE' | translate"
      [subtitle]="'COMPANIES.PAGE.SUBTITLE' | translate"
      [badge]="'COMPANIES.PAGE.BADGE' | translate"
      bgClass="bg-gradient-to-br from-slate-900 to-blue-800">

      <div class="mt-8 max-w-3xl mx-auto">
        <div class="flex flex-col gap-2 rounded-xl bg-white p-2 shadow-xl sm:flex-row">
          <div class="flex flex-1 items-center gap-2 px-3">
            <svg class="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchCompanies()"
              class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              [placeholder]="'COMPANIES.FILTER.SEARCH_PLACEHOLDER' | translate">
          </div>
          <div class="flex items-center gap-2 px-3 sm:w-56">
            <svg class="h-4 w-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            </svg>
            <input type="text" [(ngModel)]="searchLocation" (keyup.enter)="searchCompanies()"
              class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              placeholder="Location">
          </div>
          <button (click)="searchCompanies()" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700">
            {{ 'COMMON.SEARCH' | translate }}
          </button>
        </div>
      </div>
    </app-page-hero>

    <section class="min-h-screen bg-gray-50 py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (errorMessage()) {
          <div class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ errorMessage() }}
          </div>
        }

        <div class="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{{ 'COMPANIES.FILTER.LABEL' | translate }}</span>

          <select [(ngModel)]="selectedLocation"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'COMPANIES.FILTER.ALL_LOCATIONS' | translate }}</option>
            @for (location of locations(); track location) {
              <option [value]="location">{{ location }}</option>
            }
          </select>

          <p class="ml-auto text-sm text-slate-500">
            {{ 'COMPANIES.FILTER.RESULTS' | translate:{ count: filteredCompanies().length } }}
          </p>

          @if (hasActiveFilters()) {
            <button (click)="clearFilters()"
              class="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {{ 'COMPANIES.FILTER.CLEAR' | translate }}
            </button>
          }
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
              <div class="h-56 animate-pulse rounded-2xl border border-slate-100 bg-white p-6"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (company of filteredCompanies(); track company.id) {
              <div class="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
                <div class="flex items-start justify-between mb-4 gap-3">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border border-slate-100 shadow-sm bg-blue-50 text-blue-600 overflow-hidden">
                    <img [src]="companyLogo(company)" [alt]="company.name" class="h-full w-full object-cover" />
                  </div>
                  <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {{ openJobsCount(company) }} Open Jobs
                  </span>
                </div>

                <div class="mb-2">
                  <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{{ company.name }}</h3>
                  <p class="text-xs text-slate-500 mt-1">{{ company.industry || 'Company' }}</p>
                </div>

                <div class="flex items-center gap-1 text-sm text-slate-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ company.location || 'N/A' }}</span>
                </div>

                <p class="text-slate-600 text-sm mt-4 line-clamp-3 flex-grow">{{ company.description || 'No description available.' }}</p>

                <div class="pt-4 mt-4 border-t border-slate-100">
                  <button type="button"
                    (click)="viewCompanyJobs(company)"
                    class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 block">
                    View Jobs
                  </button>
                </div>
              </div>
            }
          </div>

          @if (!loading() && filteredCompanies().length === 0) {
            <div class="col-span-full py-12 text-center text-slate-500">
              <div class="w-16 h-16 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-lg font-medium text-slate-700">{{ 'COMPANIES.EMPTY.TITLE' | translate }}</p>
              <p class="mt-1">{{ 'COMPANIES.EMPTY.MESSAGE' | translate }}</p>
            </div>
          }
        }
      </div>
    </section>
  `
})
export class CompaniesComponent {
  private readonly companiesService = inject(CompaniesService);
  private readonly jobsService = inject(JobsService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly companies = signal<Company[]>([]);
  readonly companyJobCounts = signal<Record<string, number>>({});

  searchQuery = '';
  searchLocation = '';
  appliedSearchQuery = '';
  appliedSearchLocation = '';
  selectedLocation = '';

  readonly filteredCompanies = computed(() => {
    const query = this.appliedSearchQuery.trim().toLowerCase();
    const typedLocation = this.appliedSearchLocation.trim().toLowerCase();
    const location = this.selectedLocation;

    return this.companies().filter((company) => {
      const matchesQuery = !query ||
        company.name.toLowerCase().includes(query) ||
        (company.description ?? '').toLowerCase().includes(query) ||
        (company.location ?? '').toLowerCase().includes(query);
      const matchesLocationDropdown = !location || (company.location ?? '') === location;
      const matchesLocationInput = !typedLocation || (company.location ?? '').toLowerCase().includes(typedLocation);
      return matchesQuery && matchesLocationDropdown && matchesLocationInput;
    });
  });

  readonly locations = computed(() => [...new Set(
    this.companies()
      .map((company) => company.location)
      .filter((location): location is string => !!location && location.trim().length > 0)
  )]);

  constructor() {
    this.loadCompanies();
    this.loadJobCounts();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.searchLocation || this.selectedLocation);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.searchLocation = '';
    this.appliedSearchQuery = '';
    this.appliedSearchLocation = '';
    this.selectedLocation = '';
  }

  searchCompanies(): void {
    this.appliedSearchQuery = this.searchQuery;
    this.appliedSearchLocation = this.searchLocation;
  }

  viewCompanyJobs(company: Company): void {
    this.router.navigate(['/jobs'], {
      queryParams: {
        companyId: company.id
      }
    });
  }

  openJobsCount(company: Company): number {
    return this.companyJobCounts()[company.name.toLowerCase()] ?? 0;
  }

  companyLogo(company: Company): string {
    const seed = encodeURIComponent(company.name || 'company');
    return `https://ui-avatars.com/api/?name=${seed}&size=112&background=eff6ff&color=1d4ed8&bold=true`;
  }

  private loadJobCounts(): void {
    this.jobsService.getJobs({ page: 1, pageSize: 200, sortBy: 'posted', descending: true }).subscribe({
      next: (response) => {
        const counts: Record<string, number> = {};
        for (const job of response.items) {
          const key = (job.company || '').toLowerCase();
          counts[key] = (counts[key] ?? 0) + 1;
        }
        this.companyJobCounts.set(counts);
      },
      error: () => {
        this.companyJobCounts.set({});
      }
    });
  }

  private loadCompanies(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.companies.set([]);
        const message = error instanceof HttpErrorResponse
          ? (error.error?.message || error.error?.error || error.message || 'Failed to load companies.')
          : 'Failed to load companies.';
        this.errorMessage.set(message);
      },
    });
  }
}

