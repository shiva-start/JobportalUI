import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { Education } from '../../../models';

@Component({
  selector: 'app-candidate-education-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="font-bold text-gray-900">Education</h2>
        <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">+ Add</button>
      </div>

      <ng-container *ngIf="education?.length; else empty">
        <div class="space-y-4">
          <div *ngFor="let item of education" class="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ item.degree }} in {{ item.field }}</h3>
                <p class="text-sm text-gray-600">{{ item.institution }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ item.startYear }} - {{ item.endYear }}</span>
            </div>
            <p *ngIf="item.grade" class="mt-2 text-xs text-gray-500">Grade: {{ item.grade }}</p>
          </div>
        </div>
      </ng-container>

      <ng-template #empty>
        <p class="text-sm text-gray-400">No data available</p>
      </ng-template>
    </div>
  `,
})
export class CandidateEducationCardComponent {
  @Input() education: Education[] | null = [];
}
