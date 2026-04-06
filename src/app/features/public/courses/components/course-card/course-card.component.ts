import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Course } from '../../../../../models';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterLink, CommonModule, BadgeComponent],
  template: `
    <div class="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-blue-300 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">

      <!-- Thumbnail -->
      <div class="relative overflow-hidden h-44 bg-slate-100">
        <img [src]="course.thumbnail" [alt]="course.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        <!-- Price badge -->
        <div class="absolute top-3 right-3">
          @if (course.price === 0) {
            <span class="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-lg shadow">Free</span>
          } @else {
            <span class="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow">
              {{ course.currency }} {{ course.price | number }}
            </span>
          }
        </div>

        <!-- Certificate badge -->
        @if (course.certificateOffered) {
          <div class="absolute bottom-3 left-3">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 text-slate-700 text-xs font-medium rounded-md">
              <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Certificate
            </span>
          </div>
        }
      </div>

      <!-- Content -->
      <div class="flex flex-col flex-1 p-5 space-y-3">

        <!-- Level + Category -->
        <div class="flex items-center gap-2">
          <app-badge [variant]="levelVariant">{{ course.level }}</app-badge>
          <span class="text-xs text-slate-400">{{ course.category }}</span>
        </div>

        <!-- Title -->
        <a [routerLink]="['/courses', course.id]"
           class="block text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-snug">
          {{ course.title }}
        </a>

        <!-- Instructor -->
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {{ course.instructorAvatar }}
          </div>
          <span class="text-xs text-slate-500">{{ course.instructorName }}</span>
        </div>

        <!-- Rating + Duration -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-xs font-semibold text-slate-700">{{ course.rating }}</span>
            <span class="text-xs text-slate-400">({{ (course.enrolledCount / 1000).toFixed(1) }}k)</span>
          </div>
          <span class="text-xs text-slate-400">•</span>
          <span class="text-xs text-slate-500">{{ course.duration }}</span>
        </div>

        <div class="flex-grow"></div>

        <!-- CTA -->
        <a [routerLink]="['/courses', course.id]"
           class="mt-2 w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md block">
          {{ course.price === 0 ? 'Enroll Free' : 'Enroll Now' }}
        </a>
      </div>
    </div>
  `
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;

  get levelVariant(): 'green' | 'blue' | 'orange' {
    const map: Record<string, 'green' | 'blue' | 'orange'> = {
      'Beginner': 'green', 'Intermediate': 'blue', 'Advanced': 'orange'
    };
    return map[this.course.level] || 'blue';
  }
}
