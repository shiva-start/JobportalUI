import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { FaqAccordionComponent } from '../components/faq-accordion/faq-accordion.component';
import { SupportFormComponent } from '../components/support-form/support-form.component';
import { HelpService } from '../services/help.service';
import { FAQCategory } from '../../../../models';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeroComponent,
    SectionHeaderComponent,
    FaqAccordionComponent,
    SupportFormComponent,
  ],
  template: `
    <!-- Hero -->
    <app-page-hero
      title="How can we help you?"
      subtitle="Search our knowledge base or browse by category below."
      badge="Help & Support"
      bgClass="bg-gradient-to-br from-slate-800 to-slate-700">

      <!-- Search -->
      <div class="mt-8 max-w-xl mx-auto">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Search FAQs..."
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"/>
        </div>
      </div>
    </app-page-hero>

    <!-- Quick Links -->
    <section class="py-14 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (card of quickLinks; track card.label) {
            <button
              (click)="setCategory(card.category)"
              [class]="activeCategory() === card.category
                ? 'border-blue-500 bg-blue-50 shadow-card-hover'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-card-hover'"
              class="flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 shadow-card cursor-pointer">
              <div [class]="'w-10 h-10 rounded-lg flex items-center justify-center ' + card.iconBg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="card.icon"/>
                </svg>
              </div>
              <span class="text-sm font-semibold text-slate-700">{{ card.label }}</span>
            </button>
          }
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-12">

          <!-- Category sidebar -->
          <aside class="hidden lg:block">
            <div class="sticky top-24">
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Browse by topic</p>
              <nav class="space-y-1">
                @for (cat of categories; track cat) {
                  <button
                    (click)="setCategory(cat)"
                    [class]="activeCategory() === cat
                      ? 'w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm'
                      : 'w-full text-left px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-colors duration-200'">
                    {{ cat }}
                    <span class="float-right text-xs text-slate-400">{{ getFaqCount(cat) }}</span>
                  </button>
                }
              </nav>
            </div>
          </aside>

          <!-- FAQ list -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-6">
              <app-section-header
                [title]="activeCategory() || 'All Questions'"
                alignment="left"
                [subtitle]="filteredFaqs().length + ' questions'">
              </app-section-header>
              @if (activeCategory()) {
                <button (click)="setCategory(null)" class="text-xs text-blue-600 hover:text-blue-700 font-medium">Clear filter</button>
              }
            </div>

            @if (filteredFaqs().length > 0) {
              <app-faq-accordion [faqs]="filteredFaqs()"/>
            } @else {
              <div class="text-center py-12">
                <p class="text-slate-500 text-sm">No results found for "<strong>{{ searchQuery }}</strong>"</p>
                <button (click)="clearSearch()" class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">Clear search</button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Support -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-start">

          <!-- Left info -->
          <div>
            <app-section-header
              label="Still need help?"
              title="Contact our support team"
              subtitle="Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible."
              alignment="left"/>

            <div class="mt-8 space-y-5">
              @for (contact of contactInfo; track contact.label) {
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="contact.icon"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ contact.label }}</p>
                    <p class="text-sm font-medium text-slate-700 mt-0.5">{{ contact.value }}</p>
                    <p class="text-xs text-slate-400">{{ contact.note }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Support form -->
          <div class="mt-10 lg:mt-0">
            <app-support-form/>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HelpPageComponent {
  private helpService = inject(HelpService);

  searchQuery = '';
  activeCategory = signal<FAQCategory | null>(null);

  categories: FAQCategory[] = ['Candidates', 'Employers', 'General', 'Billing'];

  filteredFaqs = computed(() => {
    const cat = this.activeCategory();
    if (this.searchQuery.trim()) return this.helpService.searchFAQs(this.searchQuery);
    return this.helpService.getFAQs(cat ?? undefined);
  });

  quickLinks = [
    { label: 'For Candidates', category: 'Candidates' as FAQCategory, iconBg: 'bg-blue-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'For Employers', category: 'Employers' as FAQCategory, iconBg: 'bg-indigo-500', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'General', category: 'General' as FAQCategory, iconBg: 'bg-teal-500', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Billing', category: 'Billing' as FAQCategory, iconBg: 'bg-orange-500', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  contactInfo = [
    { label: 'Email', value: 'support@jobportal.com', note: 'We reply within 24 hours', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Live Chat', value: 'Available Mon–Fri, 9am–6pm IST', note: 'Fastest response', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { label: 'Response Time', value: 'Usually within 2–4 hours', note: 'During business hours', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  setCategory(cat: FAQCategory | null): void {
    this.searchQuery = '';
    this.activeCategory.set(cat);
  }

  onSearch(query: string): void {
    this.activeCategory.set(null);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.activeCategory.set(null);
  }

  getFaqCount(cat: FAQCategory): number {
    return this.helpService.getFAQs(cat).length;
  }
}
