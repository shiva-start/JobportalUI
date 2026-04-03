import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-candidate-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-gray-900">Skills</h2>
        <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Skill</button>
      </div>
      <ng-container *ngIf="skills?.length; else empty">
        <div class="flex flex-wrap gap-2">
          <ng-container *ngFor="let skill of skills">
            <span class="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-lg flex items-center gap-1.5">
              {{ skill }}
              <button class="text-blue-400 hover:text-blue-600 leading-none text-base">×</button>
            </span>
          </ng-container>
        </div>
      </ng-container>
      <ng-template #empty>
        <p class="text-gray-400 text-sm">No skills added yet.</p>
      </ng-template>
    </div>
  `,
})
export class CandidateSkillsComponent {
  @Input() skills: string[] | null = [];
}
