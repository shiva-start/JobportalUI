import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Internship } from '../../../../../models';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-internship-card',
  standalone: true,
  imports: [RouterLink, CommonModule, BadgeComponent],
  template: `
    <div class="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-blue-300 transition-all duration-300 ease-in-out flex flex-col h-full hover:-translate-y-1">

      <!-- Top accent -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>

      <div class="flex flex-col h-full p-6 space-y-4">

        <!-- Company header -->
        <div class="flex items-start gap-4">
          <div [class]="logoColor" class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            {{ internship.companyLogo || internship.company.slice(0,2).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ internship.company }}</p>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ internship.location }}
            </p>
          </div>
          <app-badge variant="teal">Internship</app-badge>
        </div>

        <!-- Title -->
        <a [routerLink]="['/internships', internship.id]"
           class="block text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {{ internship.title }}
        </a>

        <!-- Meta chips -->
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ internship.duration }}
          </span>
          <span class="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
            </svg>
            {{ internship.locationType }}
          </span>
          @if (internship.stipend) {
            <span class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-md">
              {{ internship.stipendCurrency }} {{ internship.stipend | number }}/mo
            </span>
          } @else {
            <span class="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">Unpaid</span>
          }
        </div>

        <!-- Skills -->
        @if (internship.skills?.length) {
          <div class="flex flex-wrap gap-1.5">
            @for (skill of internship.skills.slice(0,3); track skill) {
              <span class="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">{{ skill }}</span>
            }
            @if (internship.skills.length > 3) {
              <span class="text-xs text-slate-400 px-2.5 py-1">+{{ internship.skills.length - 3 }}</span>
            }
          </div>
        }

        <div class="flex-grow"></div>

        <!-- Footer -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="text-xs text-slate-400">
            Deadline: <span class="text-slate-600 font-medium">{{ internship.deadline | date:'MMM d, y' }}</span>
          </div>
          <a [routerLink]="['/internships', internship.id]"
             class="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1">
            View Details
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `
})
export class InternshipCardComponent {
  @Input({ required: true }) internship!: Internship;

  get logoColor(): string {
    const colors = [
      'bg-gradient-to-br from-teal-500 to-teal-700',
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-orange-500 to-orange-700',
      'bg-gradient-to-br from-green-500 to-green-700',
    ];
    const index = this.internship.id.charCodeAt(this.internship.id.length - 1) % colors.length;
    return colors[index];
  }
}
