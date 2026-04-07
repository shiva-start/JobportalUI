import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { FaqAccordionComponent } from '../components/faq-accordion/faq-accordion.component';
import { SupportFormComponent } from '../components/support-form/support-form.component';
import { HelpService } from '../services/help.service';
import { FAQCategory } from '../../../../models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, PageHeroComponent, SectionHeaderComponent, FaqAccordionComponent, SupportFormComponent],
  template: `
    <app-page-hero
      [title]="'HELP.PAGE.TITLE' | translate"
      [subtitle]="'HELP.PAGE.SUBTITLE' | translate"
      [badge]="'HELP.PAGE.BADGE' | translate"
      bgClass="bg-gradient-to-br from-slate-800 to-slate-700">
      <div class="mt-8 max-w-xl mx-auto">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)"
            [placeholder]="'HELP.PAGE.SEARCH_PLACEHOLDER' | translate"
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-800 text-sm placeholder:text-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"/>
        </div>
      </div>
    </app-page-hero>

    <section class="py-14 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (card of quickLinks; track card.labelKey) {
            <button (click)="setCategory(card.category)"
              [class]="activeCategory() === card.category ? 'border-blue-500 bg-blue-50 shadow-card-hover' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-card-hover'"
              class="flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 shadow-card cursor-pointer">
              <div [class]="'w-10 h-10 rounded-lg flex items-center justify-center ' + card.iconBg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="card.icon"/>
                </svg>
              </div>
              <span class="text-sm font-semibold text-slate-700">{{ card.labelKey | translate }}</span>
            </button>
          }
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-12">
          <aside class="hidden lg:block">
            <div class="sticky top-24">
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">{{ 'HELP.PAGE.BROWSE_BY_TOPIC' | translate }}</p>
              <nav class="space-y-1">
                @for (cat of categories; track cat) {
                  <button (click)="setCategory(cat)"
                    [class]="activeCategory() === cat ? 'w-full text-left px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm' : 'w-full text-left px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium text-sm transition-colors duration-200'">
                    {{ categoryKey(cat) | translate }}
                    <span class="float-right text-xs text-slate-400">{{ getFaqCount(cat) }}</span>
                  </button>
                }
              </nav>
            </div>
          </aside>

          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-6">
              <app-section-header
                [title]="activeCategory() ? (categoryKey(activeCategory()!) | translate) : ('HELP.PAGE.ALL_QUESTIONS' | translate)"
                alignment="left"
                [subtitle]="'HELP.PAGE.QUESTIONS_COUNT' | translate:{ count: filteredFaqs().length }">
              </app-section-header>
              @if (activeCategory()) {
                <button (click)="setCategory(null)" class="text-xs text-blue-600 hover:text-blue-700 font-medium">{{ 'HELP.PAGE.CLEAR_FILTER' | translate }}</button>
              }
            </div>

            @if (filteredFaqs().length > 0) {
              <app-faq-accordion [faqs]="filteredFaqs()"/>
            } @else {
              <div class="text-center py-12">
                <p class="text-slate-500 text-sm">{{ 'HELP.PAGE.NO_RESULTS' | translate:{ query: searchQuery } }}</p>
                <button (click)="clearSearch()" class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">{{ 'HELP.PAGE.CLEAR_SEARCH' | translate }}</button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <app-section-header [label]="'HELP.CONTACT.LABEL' | translate" [title]="'HELP.CONTACT.TITLE' | translate" [subtitle]="'HELP.CONTACT.SUBTITLE' | translate" alignment="left"/>
            <div class="mt-8 space-y-5">
              @for (contact of contactInfo; track contact.labelKey) {
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="contact.icon"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">{{ contact.labelKey | translate }}</p>
                    <p class="text-sm font-medium text-slate-700 mt-0.5">{{ contact.valueKey ? (contact.valueKey | translate) : contact.value }}</p>
                    <p class="text-xs text-slate-400">{{ contact.noteKey | translate }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

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
  private languageService = inject(LanguageService);

  searchQuery = '';
  activeCategory = signal<FAQCategory | null>(null);
  categories: FAQCategory[] = ['Candidates', 'Employers', 'General', 'Billing'];

  filteredFaqs = computed(() => {
    this.languageService.currentLanguage();
    const cat = this.activeCategory();
    if (this.searchQuery.trim()) return this.helpService.searchFAQs(this.searchQuery);
    return this.helpService.getFAQs(cat ?? undefined);
  });

  quickLinks = [
    { labelKey: 'HELP.QUICK_LINKS.CANDIDATES', category: 'Candidates' as FAQCategory, iconBg: 'bg-blue-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { labelKey: 'HELP.QUICK_LINKS.EMPLOYERS', category: 'Employers' as FAQCategory, iconBg: 'bg-indigo-500', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { labelKey: 'HELP.QUICK_LINKS.GENERAL', category: 'General' as FAQCategory, iconBg: 'bg-teal-500', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { labelKey: 'HELP.QUICK_LINKS.BILLING', category: 'Billing' as FAQCategory, iconBg: 'bg-orange-500', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  contactInfo = [
    { labelKey: 'HELP.CONTACT.INFO.EMAIL.LABEL', value: 'support@jobportal.com', noteKey: 'HELP.CONTACT.INFO.EMAIL.NOTE', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { labelKey: 'HELP.CONTACT.INFO.LIVE_CHAT.LABEL', valueKey: 'HELP.CONTACT.INFO.LIVE_CHAT.VALUE', noteKey: 'HELP.CONTACT.INFO.LIVE_CHAT.NOTE', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { labelKey: 'HELP.CONTACT.INFO.RESPONSE_TIME.LABEL', valueKey: 'HELP.CONTACT.INFO.RESPONSE_TIME.VALUE', noteKey: 'HELP.CONTACT.INFO.RESPONSE_TIME.NOTE', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
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
    this.languageService.currentLanguage();
    return this.helpService.getFAQs(cat).length;
  }

  categoryKey(cat: FAQCategory): string {
    return `HELP.CATEGORIES.${cat.toUpperCase()}`;
  }
}
