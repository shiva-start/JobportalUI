import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[100] space-y-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [ngClass]="getClasses(toast.type)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border pointer-events-auto min-w-[280px] max-w-sm animate-slide-up">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" [attr.d]="getIconPath(toast.type)"/>
          </svg>
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
          <button (click)="toastService.remove(toast.id)"
            class="text-current opacity-60 hover:opacity-100 transition-opacity duration-200 ml-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getClasses(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-50 text-green-800 border-green-200',
      error: 'bg-red-50 text-red-800 border-red-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    };
    return map[type] || map['info'];
  }

  getIconPath(type: string): string {
    const map: Record<string, string> = {
      success: 'M5 13l4 4L19 7',
      error: 'M6 18L18 6M6 6l12 12',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
    };
    return map[type] || map['info'];
  }
}
