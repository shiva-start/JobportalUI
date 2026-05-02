import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentBlogPost, ContentService } from '../../../../core/services/content.service';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly contentService = inject(ContentService);

  getAll(): Observable<ContentBlogPost[]> {
    return this.contentService.getBlogPosts();
  }

  getById(id: string): Observable<ContentBlogPost> {
    return this.contentService.getBlogPostById(id);
  }
}
