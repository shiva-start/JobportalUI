import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQ } from '../../../../../models';

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      @for (faq of faqs; track faq.id) {
        <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card transition-shadow duration-200"
             [class.shadow-card-hover]="openId() === faq.id">
          <button
            class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors duration-200"
            (click)="toggle(faq.id)">
            <span class="text-sm font-semibold text-slate-800 pr-4">{{ faq.question }}</span>
            <svg
              class="w-5 h-5 text-blue-500 flex-shrink-0 transition-transform duration-300"
              [class.rotate-180]="openId() === faq.id"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          @if (openId() === faq.id) {
            <div class="px-6 pb-5 animate-fade-in">
              <div class="h-px bg-slate-100 mb-4"></div>
              <p class="text-sm text-slate-600 leading-relaxed">{{ faq.answer }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class FaqAccordionComponent {
  @Input({ required: true }) faqs!: FAQ[];
  openId = signal<string | null>(null);

  toggle(id: string): void {
    this.openId.update(current => current === id ? null : id);
  }
}
