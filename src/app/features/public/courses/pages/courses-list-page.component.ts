import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../../shared/components/page-hero/page-hero.component';
import { ContentCourse, ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-courses-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-page-hero
        title="Courses"
        subtitle="Build in-demand skills with curated learning tracks."
        badge="Upskill Faster"
        bgClass="bg-gradient-to-br from-indigo-700 to-blue-700">
      </app-page-hero>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        @if (error()) { <p class="text-red-600 mb-4">{{ error() }}</p> }
        @if (loading()) { <p>Loading courses...</p> }
        @if (!loading() && !error() && courses().length === 0) { <p>No courses found</p> }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (course of courses(); track course.id) {
            <a [routerLink]="['/courses', course.id]" class="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block">
              <img src="https://source.unsplash.com/featured/?online-course,learning" [alt]="course.title" class="h-44 w-full object-cover" />
              <div class="p-5">
                <h2 class="font-semibold text-lg text-slate-900 group-hover:text-blue-600 line-clamp-2">{{ course.title }}</h2>
                <div class="text-sm text-slate-500 mt-2 space-y-1">
                  <p>Provider: Job Portal Academy</p>
                  <p>Duration: {{ course.duration }}</p>
                  <p>Level: {{ course.level || 'General' }}</p>
                </div>
              </div>
            </a>
          }
        </div>
      </section>
    </div>
  `
})
export class CoursesListPageComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  protected readonly courses = signal<ContentCourse[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.contentService.getCourses().subscribe({
      next: courses => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.status === 500 ? 'Server error while loading courses.' : 'Failed to load courses.');
        this.loading.set(false);
      }
    });
  }
}

