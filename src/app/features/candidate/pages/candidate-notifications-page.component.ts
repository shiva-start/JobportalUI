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
        <h1 class="text-2xl font-bold text-gray-900 rtl:text-right">{{ 'CANDIDATE.NOTIFICATIONS.TITLE' | translate }}</h1>
        <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ 'CANDIDATE.NOTIFICATIONS.SUBTITLE' | translate }}</p>
      </div>

      @if (candidate.localizedNotifications().length) {
        <div class="space-y-4">
          @for (note of candidate.localizedNotifications(); track note.id) {
            <div class="bg-white rounded-xl shadow-sm p-5">
              <div class="flex flex-wrap items-start justify-between gap-3 rtl:flex-row-reverse">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-end">
                    <h2 class="font-semibold text-gray-900 rtl:text-right">{{ note.title }}</h2>
                    @if (!note.read) {
                      <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">{{ 'CANDIDATE.NOTIFICATIONS.NEW_BADGE' | translate }}</span>
                    }
                  </div>
                  <p class="mt-2 text-sm text-gray-500 rtl:text-right">{{ note.message }}</p>
                </div>
                <p class="text-xs text-gray-400 rtl:text-right">{{ $any(note).dateLabel || (note.date | date:'mediumDate') }}</p>
              </div>
              <div class="mt-4 flex items-center gap-3 rtl:flex-row-reverse rtl:justify-end">
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
          <p class="text-gray-400 rtl:text-right">{{ 'CANDIDATE.NO_DATA' | translate }}</p>
        </div>
      }
    </section>
  `,
})
export class CandidateNotificationsPageComponent {
  readonly candidate = inject(CandidateDashboardService);
}
