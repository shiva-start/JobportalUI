import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'job-card') {
      <div class="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-3/5 mb-4"></div>
        <div class="flex gap-3 mb-4">
          <div class="h-5 bg-gray-200 rounded-full w-16"></div>
          <div class="h-5 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div class="flex gap-2 mb-4">
          <div class="h-5 bg-gray-100 rounded w-14"></div>
          <div class="h-5 bg-gray-100 rounded w-16"></div>
          <div class="h-5 bg-gray-100 rounded w-12"></div>
        </div>
        <div class="flex justify-between pt-3 border-t border-gray-100">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="h-4 bg-gray-200 rounded w-4"></div>
        </div>
      </div>
    }

    @if (type === 'text') {
      <div class="animate-pulse space-y-2">
        @for (line of lines; track $index) {
          <div class="h-4 bg-gray-200 rounded" [style.width]="line"></div>
        }
      </div>
    }

    @if (type === 'circle') {
      <div class="animate-pulse rounded-full bg-gray-200" [style.width.px]="size" [style.height.px]="size"></div>
    }
  `
})
export class SkeletonComponent {
  @Input() type: 'job-card' | 'text' | 'circle' = 'job-card';
  @Input() size = 48;
  @Input() lines: string[] = ['100%', '80%', '60%'];
}
