import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <div class="flex items-center justify-center gap-1 mt-10">
        <!-- Prev -->
        <button
          (click)="changePage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Page numbers -->
        @for (page of pages(); track page) {
          @if (page === -1) {
            <span class="px-3 py-2 text-slate-400 text-sm">…</span>
          } @else {
            <button
              (click)="changePage(page)"
              [class]="page === currentPage
                ? 'w-9 h-9 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm'
                : 'w-9 h-9 rounded-lg border border-slate-200 text-slate-600 text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200'">
              {{ page }}
            </button>
          }
        }

        <!-- Next -->
        <button
          (click)="changePage(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          class="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    }
  `
})
export class PaginationComponent {
  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) totalPages!: number;
  @Output() pageChange = new EventEmitter<number>();

  pages = computed(() => {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, -1, total];
    if (current >= total - 3) return [1, -1, total - 4, total - 3, total - 2, total - 1, total];
    return [1, -1, current - 1, current, current + 1, -1, total];
  });

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
