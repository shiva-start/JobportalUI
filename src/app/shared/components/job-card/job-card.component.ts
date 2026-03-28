import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Job } from '../../../models';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RouterLink, CommonModule, BadgeComponent],
  template: `
    <div [class]="cardClasses"
         class="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer relative">

      <!-- Featured ribbon -->
      @if (job.featured) {
        <div class="absolute top-3 right-3">
          <app-badge variant="indigo">Featured</app-badge>
        </div>
      }

      <!-- Company info -->
      <div class="flex items-start gap-3 mb-3">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
             [class]="logoColor">
          {{ job.companyLogo || job.company.slice(0,2).toUpperCase() }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium text-gray-500 truncate">{{ job.company }}</p>
          <p class="text-xs text-gray-400 truncate">{{ job.location }}</p>
        </div>
      </div>

      <!-- Job title -->
      <a [routerLink]="['/jobs', job.id]"
         class="block text-gray-900 font-semibold text-base mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
        {{ job.title }}
      </a>

      <!-- Badges row -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <app-badge [variant]="typeVariant">{{ formatType(job.type) }}</app-badge>
        <app-badge variant="gray">{{ formatLevel(job.experienceLevel) }}</app-badge>
      </div>

      <!-- Skills -->
      <div class="flex flex-wrap gap-1 mb-4">
        @for (skill of job.skills.slice(0, 3); track skill) {
          <span class="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">{{ skill }}</span>
        }
        @if (job.skills.length > 3) {
          <span class="text-xs text-gray-400 px-2 py-0.5">+{{ job.skills.length - 3 }} more</span>
        }
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <div class="flex items-center gap-3">
          @if (job.salary) {
            <span class="text-sm font-semibold text-green-600">{{ job.salary }}</span>
          }
          <span class="text-xs text-gray-400">{{ timeAgo(job.postedAt) }}</span>
        </div>

        <button (click)="onSaveToggle($event)"
          class="p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          [title]="saved ? 'Remove from saved' : 'Save job'">
          @if (saved) {
            <svg class="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          } @else {
            <svg class="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          }
        </button>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
  @Input() saved = false;
  @Input() compact = false;
  @Output() saveToggle = new EventEmitter<string>();

  get cardClasses(): string {
    return this.compact ? 'h-full' : '';
  }

  get logoColor(): string {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-teal-500 to-teal-700',
      'bg-gradient-to-br from-orange-500 to-orange-700',
      'bg-gradient-to-br from-green-500 to-green-700',
    ];
    const index = this.job.id.charCodeAt(0) % colors.length;
    return colors[index];
  }

  get typeVariant(): 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gray' {
    const map: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'gray'> = {
      'full-time': 'blue',
      'part-time': 'purple',
      'contract': 'orange',
      'remote': 'green',
      'internship': 'teal',
    };
    return map[this.job.type] || 'gray';
  }

  onSaveToggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.saveToggle.emit(this.job.id);
  }

  formatType(type: string): string {
    return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  formatLevel(level: string): string {
    const map: Record<string, string> = {
      entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior',
      lead: 'Lead', executive: 'Executive'
    };
    return map[level] || level;
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  }
}
