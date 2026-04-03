import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { CandidateResume } from '../../../models';

@Component({
  selector: 'app-candidate-resume-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="font-bold text-gray-900">Resume</h2>
        <button *ngIf="resume" type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">View</button>
      </div>

      <ng-container *ngIf="resume; else empty">
        <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p class="text-sm font-semibold text-gray-900">{{ resume.name }}</p>
          <p class="mt-1 text-xs text-gray-400">
            Uploaded {{ resume.uploadedAt | date:'mediumDate' }} · {{ resume.sizeLabel }}
          </p>
        </div>
      </ng-container>

      <ng-template #empty>
        <p class="mb-4 text-sm text-gray-400">No data available</p>
      </ng-template>

      <button
        type="button"
        (click)="upload.emit()"
        class="mt-4 w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 transition hover:border-blue-400 hover:text-blue-600"
      >
        Upload Resume
      </button>
    </div>
  `,
})
export class CandidateResumeCardComponent {
  @Input() resume: CandidateResume | null = null;
  @Output() upload = new EventEmitter<void>();
}
