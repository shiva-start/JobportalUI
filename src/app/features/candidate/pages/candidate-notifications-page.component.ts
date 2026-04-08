import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CandidateDashboardService } from '../../../core/services/candidate-dashboard.service';

@Component({
  selector: 'app-candidate-notifications-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <section class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ 'CANDIDATE.NOTIFICATIONS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500">{{ 'CANDIDATE.NOTIFICATIONS.SUBTITLE' | translate }}</p>
      </div>

      @if (candidate.notifications().length) {
        <div class="space-y-4">
          @for (note of candidate.notifications(); track note.id) {
            <div class="bg-white rounded-xl shadow-sm p-5">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="font-semibold text-gray-900">{{ note.title }}</h2>
                    @if (!note.read) {
                      <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">{{ 'CANDIDATE.NOTIFICATIONS.NEW_BADGE' | translate }}</span>
                    }
                  </div>
                  <p class="mt-2 text-sm text-gray-500">{{ note.message }}</p>
                </div>
                <p class="text-xs text-gray-400">{{ note.date | date:'mediumDate' }}</p>
              </div>
              <div class="mt-4 flex items-center gap-3">
                <button type="button" (click)="candidate.markNotificationRead(note.id)" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                  {{ 'CANDIDATE.NOTIFICATIONS.MARK_READ' | translate }}
                </button>
                @if (note.actionRoute) {
                  <a [routerLink]="note.actionRoute" class="text-sm font-medium text-gray-600 hover:text-gray-900">{{ note.actionLabel }}</a>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-400">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
        </div>
      }
    </section>
  `,
})
export class CandidateNotificationsPageComponent {
  readonly candidate = inject(CandidateDashboardService);
}
