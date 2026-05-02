import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpService, FaqItem } from '../services/help.service';

type HelpCategory = 'All' | 'Employers' | 'Candidates' | 'Hiring' | 'Billing';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50">
      <section class="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 py-20">
        <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px); background-size: 28px 28px;"></div>
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 class="text-4xl font-bold tracking-tight">How can we help you?</h1>
          <p class="mt-3 text-blue-100">Search our knowledge base or browse by category below.</p>
          <div class="mt-8 rounded-xl bg-white p-2 shadow-xl max-w-2xl mx-auto">
            <input [ngModel]="searchText()" (ngModelChange)="onSearchChange($event)" type="text" placeholder="Search FAQs..."
              class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (cat of categories; track cat) {
            @if (cat !== 'All') {
              <button type="button" (click)="selectCategory(cat)"
                [class]="selectedCategory() === cat ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'"
                class="rounded-2xl border p-5 text-left shadow-sm transition-all duration-200">
                <p class="text-xs font-semibold uppercase tracking-wide opacity-75">Category</p>
                <h3 class="mt-2 text-lg font-semibold">{{ cat }}</h3>
              </button>
            }
          }
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        @if (error()) {
          <p class="text-red-600 mb-4">{{ error() }}</p>
        }
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside class="lg:col-span-3">
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sticky top-24">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">Categories</h3>
              <div class="space-y-1">
                @for (cat of categories; track cat) {
                  <button type="button" (click)="selectCategory(cat)"
                    [class]="selectedCategory() === cat ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'"
                    class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors">{{ cat === 'All' ? 'All Questions' : cat }}</button>
                }
              </div>
            </div>
          </aside>

          <div class="lg:col-span-9">
            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="mb-4 flex items-center justify-between gap-2">
                <h2 class="text-2xl font-bold text-slate-900">All Questions</h2>
                <span class="text-sm text-slate-500">{{ filteredFaqs().length }} results</span>
              </div>

              @if (loading()) {
                <p>Loading FAQs...</p>
              } @else if (!error() && filteredFaqs().length === 0) {
                <p class="text-slate-500">No FAQs found for this category.</p>
              } @else {
                <div class="space-y-3">
                  @for (faq of filteredFaqs(); track faq.id) {
                    <details class="rounded-xl border border-slate-200 bg-white p-4 group">
                      <summary class="list-none cursor-pointer flex items-center justify-between gap-3">
                        <span class="font-semibold text-slate-800">{{ faq.question }}</span>
                        <span class="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                      </summary>
                      <p class="mt-3 text-sm text-slate-600 leading-relaxed">{{ faq.answer }}</p>
                    </details>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
              <h2 class="text-2xl font-bold text-slate-900">Contact our support team</h2>
              <p class="mt-2 text-sm text-slate-600">Send us a message and we'll get back within the same business day.</p>
              <div class="mt-6 space-y-3 text-sm text-slate-700">
                <p><span class="font-semibold">Email:</span> support@jobportal.com</p>
                <p><span class="font-semibold">Live Chat:</span> Mon-Fri, 9 AM - 6 PM</p>
                <p><span class="font-semibold">Response Time:</span> 2-4 hours</p>
              </div>
            </div>

            <form class="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" class="sm:col-span-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Email" class="sm:col-span-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select class="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select category</option>
                @for (cat of categories; track cat) {
                  @if (cat !== 'All') {
                    <option>{{ cat }}</option>
                  }
                }
              </select>
              <input type="text" placeholder="Subject" class="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea rows="5" placeholder="Message" class="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              <button type="button" class="sm:col-span-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HelpPageComponent implements OnInit {
  private readonly helpService = inject(HelpService);

  protected readonly faqs = signal<FaqItem[]>([]);
  protected readonly filteredFaqs = signal<FaqItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly searchText = signal('');
  protected readonly selectedCategory = signal<HelpCategory>('All');

  protected readonly categories: HelpCategory[] = ['All', 'Employers', 'Candidates', 'Hiring', 'Billing'];

  protected readonly categoryKeywordsMap: Record<HelpCategory, string[]> = {
    All: [],
    Candidates: ['candidate', 'apply', 'resume', 'profile', 'job search'],
    Employers: ['employer', 'company', 'post job', 'job listing'],
    Hiring: ['hire', 'hiring', 'recruit', 'recruitment'],
    Billing: ['payment', 'billing', 'subscription', 'price', 'plan', 'refund']
  };

  ngOnInit(): void {
    this.helpService.getFAQs().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs.filter((x) => x.isActive));
        this.filterFaqs();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.status === 500 ? 'Server error while loading FAQs.' : 'Failed to load FAQs.');
        this.loading.set(false);
      }
    });
  }

  protected selectCategory(category: HelpCategory): void {
    this.selectedCategory.set(category);
    this.filterFaqs();
  }

  protected onSearchChange(value: string): void {
    this.searchText.set(value);
    this.filterFaqs();
  }

  protected filterFaqs(): void {
    let result = this.faqs();

    if (this.selectedCategory() !== 'All') {
      const keywords = this.categoryKeywordsMap[this.selectedCategory()];
      result = result.filter((faq) => {
        const text = `${faq.question} ${faq.answer || ''}`.toLowerCase();
        return keywords.some((keyword) => text.includes(keyword));
      });
    }

    const search = this.searchText().trim().toLowerCase();
    if (search) {
      result = result.filter((faq) =>
        `${faq.question} ${faq.answer || ''}`.toLowerCase().includes(search)
      );
    }

    this.filteredFaqs.set(result);
  }
}
