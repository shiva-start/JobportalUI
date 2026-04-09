import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { WorkExperience } from '../../../models';

@Component({
  selector: 'app-candidate-experience-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div class="mb-5 flex items-center justify-between rtl:flex-row-reverse">
        <h2 class="font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.PROFILE.EXPERIENCE' | translate }}</h2>
        <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.PROFILE.ADD' | translate }}</button>
      </div>

      <ng-container *ngIf="experience?.length; else empty">
        <div class="space-y-5">
          <div *ngFor="let exp of experience" class="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 rtl:flex-row-reverse">
            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-700">
              {{ exp.company.slice(0, 2).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1 rtl:text-right">
              <div class="flex flex-wrap items-start justify-between gap-2 rtl:flex-row-reverse">
                <div class="rtl:text-right">
                  <h3 class="text-sm font-semibold text-gray-900">{{ exp.title }}</h3>
                  <p class="text-sm text-gray-600">{{ exp.company }} · {{ exp.location }}</p>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-400 rtl:flex-row-reverse">
                  <span>{{ exp.startDate }} - {{ exp.endDate }}</span>
                  <span *ngIf="exp.current" class="rounded-full bg-green-100 px-2 py-1 text-green-600">{{ 'CANDIDATE.PROFILE.CURRENT' | translate }}</span>
                </div>
              </div>
              <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #empty>
        <p class="text-sm text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
      </ng-template>
    </div>
  `,
})
export class CandidateExperienceCardComponent {
  @Input() experience: WorkExperience[] | null = [];
}
