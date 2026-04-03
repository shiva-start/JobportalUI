import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { WorkExperience } from '../../../models';

@Component({
  selector: 'app-candidate-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-bold text-gray-900">Work Experience</h2>
        <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add</button>
      </div>

      <ng-container *ngIf="experience?.length; else none">
        <div class="space-y-0">
          <ng-container *ngFor="let exp of experience; let last = last">
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                  {{ exp.company.slice(0,2).toUpperCase() }}
                </div>
                <div *ngIf="!last" class="w-px flex-1 bg-gray-200 my-1"></div>
              </div>
              <div class="flex-1 pb-5">
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 class="font-semibold text-gray-900 text-sm">{{ exp.title }}</h3>
                    <p class="text-sm text-gray-600">{{ exp.company }} · {{ exp.location }}</p>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-xs text-gray-400">{{ exp.startDate }} – {{ exp.endDate }}</span>
                    <ng-container *ngIf="exp.current">
                      <span class="inline-flex items-center px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-full">Current</span>
                    </ng-container>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ exp.description }}</p>
              </div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-template #none>
        <p class="text-gray-400 text-sm">No experience added yet.</p>
      </ng-template>
    </div>
  `,
})
export class CandidateExperienceComponent {
  @Input() experience: WorkExperience[] | null = [];
}
