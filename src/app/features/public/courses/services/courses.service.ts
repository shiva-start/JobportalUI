import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentCourse, ContentService } from '../../../../core/services/content.service';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private readonly contentService = inject(ContentService);

  getAll(): Observable<ContentCourse[]> {
    return this.contentService.getCourses();
  }

  getById(id: string): Observable<ContentCourse> {
    return this.contentService.getCourseById(id);
  }
}
