import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" [attr.d]="iconPath"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-1">{{ title }}</h3>
      <p class="text-sm text-slate-500 max-w-xs">{{ message }}</p>
      @if (actionLabel) {
        <button
          (click)="action.emit()"
          class="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
          {{ actionLabel }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input() message = 'Nothing to show here yet.';
  @Input() actionLabel = '';
  @Input() icon: 'search' | 'document' | 'inbox' | 'bookmark' = 'search';
  @Output() action = new EventEmitter<void>();

  get iconPath(): string {
    const paths: Record<string, string> = {
      search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      inbox: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
      bookmark: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    };
    return paths[this.icon] || paths['search'];
  }
}
