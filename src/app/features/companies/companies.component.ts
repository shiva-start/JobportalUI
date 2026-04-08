import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

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
            <input type="text" [(ngModel)]="searchQuery"
              class="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              [placeholder]="'COMPANIES.FILTER.SEARCH_PLACEHOLDER' | translate">
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
          <span class="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{{ 'COMPANIES.FILTER.LABEL' | translate }}</span>

          <select [(ngModel)]="selectedIndustry"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'COMPANIES.FILTER.ALL_INDUSTRIES' | translate }}</option>
            @for (industry of industries; track industry) {
              <option [value]="industry">{{ industryKey(industry) | translate }}</option>
            }
          </select>

          <select [(ngModel)]="selectedLocation"
            class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ 'COMPANIES.FILTER.ALL_LOCATIONS' | translate }}</option>
            @for (location of locations; track location) {
              <option [value]="location">{{ location }}</option>
            }
          </select>

          <p class="ml-auto text-sm text-slate-500">
            {{ 'COMPANIES.FILTER.RESULTS' | translate:{ count: filteredCompanies.length } }}
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

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        @for (company of filteredCompanies; track company.id) {
          <div class="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border border-slate-100 shadow-sm"
                   [ngClass]="company.colorClass">
                {{ company.name.charAt(0) }}
              </div>
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                {{ industryKey(company.industry) | translate }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{{ companyNameKey(company.name) | translate }}</h3>
            
            <div class="flex items-center gap-1 mt-1.5 text-sm text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ locationKey(company.location) | translate }}</span>
            </div>

            <p class="text-slate-600 text-sm mt-4 line-clamp-2 flex-grow">{{ descriptionKey(company.description) | translate }}</p>

            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span class="font-medium text-slate-700">{{ 'COMPANIES.CARD.OPEN_JOBS' | translate:{ count: company.openJobs } }}</span>
              <span class="text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                {{ 'COMPANIES.CARD.VIEW' | translate }}
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
        }

        @if (filteredCompanies.length === 0) {
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
        </div>
      </div>
    </section>
  `
})
export class CompaniesComponent {
  searchQuery = '';
  selectedIndustry = '';
  selectedLocation = '';

  companies = [
    { id: 'c1', name: 'TechFlow', industry: 'Software', location: 'San Francisco, CA', description: 'Building the next generation of seamless workflow automation tools for modern teams.', openJobs: 12, colorClass: 'bg-blue-50 text-blue-600' },
    { id: 'c2', name: 'Global Health', industry: 'Healthcare', location: 'New York, NY', description: 'Innovative health tech solutions bridging the gap between patients and medical professionals.', openJobs: 8, colorClass: 'bg-emerald-50 text-emerald-600' },
    { id: 'c3', name: 'FinTrust', industry: 'Fintech', location: 'London, UK', description: 'Democratizing algorithmic trading and secure asset management for everyday users.', openJobs: 4, colorClass: 'bg-indigo-50 text-indigo-600' },
    { id: 'c4', name: 'CloudScale', industry: 'Cloud Ops', location: 'Austin, TX', description: 'Enterprise cloud infrastructure simplified. We help scale businesses securely.', openJobs: 15, colorClass: 'bg-sky-50 text-sky-600' },
    { id: 'c5', name: 'DesignHub', industry: 'Agency', location: 'Berlin, DE', description: 'Award-winning creative agency focused on digital experiences and brand identity.', openJobs: 3, colorClass: 'bg-rose-50 text-rose-600' },
    { id: 'c6', name: 'EduSphere', industry: 'EdTech', location: 'Remote', description: 'Accessible online learning platforms that empower students globally.', openJobs: 6, colorClass: 'bg-amber-50 text-amber-600' },
    { id: 'c7', name: 'AutoDrive AI', industry: 'Automotive', location: 'Detroit, MI', description: 'Pioneering autonomous vehicle software using advanced neural networks.', openJobs: 22, colorClass: 'bg-slate-100 text-slate-600' },
    { id: 'c8', name: 'GreenEnergy', industry: 'Cleantech', location: 'Denver, CO', description: 'Renewable energy solutions focusing on smart grid optimization and solar integration.', openJobs: 9, colorClass: 'bg-green-50 text-green-600' }
  ];

  get industries() {
    return [...new Set(this.companies.map(company => company.industry))];
  }

  get locations() {
    return [...new Set(this.companies.map(company => company.location))];
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedIndustry || this.selectedLocation);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedIndustry = '';
    this.selectedLocation = '';
  }

  get filteredCompanies() {
    const query = this.searchQuery.toLowerCase();
    return this.companies.filter(c => {
      const matchesQuery = !query ||
        c.name.toLowerCase().includes(query) ||
        c.industry.toLowerCase().includes(query);
      const matchesIndustry = !this.selectedIndustry || c.industry === this.selectedIndustry;
      const matchesLocation = !this.selectedLocation || c.location === this.selectedLocation;

      return matchesQuery && matchesIndustry && matchesLocation;
    });
  }

  industryKey(industry: string): string {
    return `COMPANIES.INDUSTRIES.${industry.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  }

  companyNameKey(name: string): string {
    return `COMPANIES.NAMES.${name.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  }

  locationKey(location: string): string {
    return `COMPANIES.LOCATIONS.${location.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
  }

  descriptionKey(description: string): string {
    const map: Record<string, string> = {
      'Building the next generation of seamless workflow automation tools for modern teams.': 'COMPANIES.DESCRIPTIONS.TECHFLOW',
      'Innovative health tech solutions bridging the gap between patients and medical professionals.': 'COMPANIES.DESCRIPTIONS.GLOBAL_HEALTH',
      'Democratizing algorithmic trading and secure asset management for everyday users.': 'COMPANIES.DESCRIPTIONS.FINTRUST',
      'Enterprise cloud infrastructure simplified. We help scale businesses securely.': 'COMPANIES.DESCRIPTIONS.CLOUDSCALE',
      'Award-winning creative agency focused on digital experiences and brand identity.': 'COMPANIES.DESCRIPTIONS.DESIGNHUB',
      'Accessible online learning platforms that empower students globally.': 'COMPANIES.DESCRIPTIONS.EDUSPHERE',
      'Pioneering autonomous vehicle software using advanced neural networks.': 'COMPANIES.DESCRIPTIONS.AUTODRIVE_AI',
      'Renewable energy solutions focusing on smart grid optimization and solar integration.': 'COMPANIES.DESCRIPTIONS.GREENENERGY'
    };

    return map[description] ?? description;
  }
}
