import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-candidate-skills-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div class="mb-4 flex items-center justify-between rtl:flex-row-reverse">
        <h2 class="font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.PROFILE.SKILLS' | translate }}</h2>
        <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">{{ 'CANDIDATE.PROFILE.ADD_SKILL' | translate }}</button>
      </div>

      <ng-container *ngIf="skills?.length; else empty">
        <div class="flex flex-wrap gap-2">
          <span
            *ngFor="let skill of skills"
            class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
          >
            {{ skill }}
          </span>
        </div>
      </ng-container>

      <ng-template #empty>
        <p class="text-sm text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
      </ng-template>
    </div>
  `,
})
export class CandidateSkillsCardComponent {
  @Input() skills: string[] | null = [];
}
