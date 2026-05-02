import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentCourse, ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-4xl mx-auto p-6">
      <a routerLink="/courses" class="text-blue-600">Back to Courses</a>
      @if (error()) { <p class="text-red-600 mt-4">{{ error() }}</p> }
      @if (loading()) { <p class="mt-4">Loading course...</p> }
      @if (!loading() && course()) {
        <article class="mt-4 border rounded-xl p-6 bg-white shadow-card">
          <img src="https://source.unsplash.com/featured/?online-course,learning" [alt]="course()!.title" class="h-64 w-full object-cover rounded-lg mb-5" />
          <h1 class="text-3xl font-bold">{{ course()!.title }}</h1>
          <p class="text-sm text-slate-500 mt-1">{{ course()!.level || 'General' }} • {{ course()!.duration }}</p>
          <p class="mt-4">{{ course()!.description }}</p>
        </article>
      }
    </section>
  `
})
export class CourseDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly contentService = inject(ContentService);

  protected readonly course = signal<ContentCourse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('404 Not Found');
      this.loading.set(false);
      return;
    }

    this.contentService.getCourseById(id).subscribe({
      next: course => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.status === 404 ? '404 Not Found' : 'Failed to load course details.');
        this.loading.set(false);
      }
    });
  }
}

