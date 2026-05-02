import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentInternship, ContentService } from '../../../../core/services/content.service';

@Injectable({ providedIn: 'root' })
export class InternshipsService {
  private readonly contentService = inject(ContentService);

  getAll(): Observable<ContentInternship[]> {
    return this.contentService.getInternships();
  }

  getById(id: string): Observable<ContentInternship> {
    return this.contentService.getInternshipById(id);
  }
}
