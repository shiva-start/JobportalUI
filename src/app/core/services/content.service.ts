import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContentBlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isPublished: boolean;
}

export interface ContentCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string | null;
  createdAt: string;
}

export interface ContentInternship {
  id: string;
  title: string;
  companyName: string;
  location: string;
  stipend: number | null;
  createdAt: string;
}

export interface ContentFaq {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl.replace(/\/+$/, '');

  getBlogPosts(): Observable<ContentBlogPost[]> {
    return this.http.get<ContentBlogPost[]>(`${this.apiUrl}/blog/posts`);
  }

  getBlogPostById(id: string): Observable<ContentBlogPost> {
    return this.http.get<ContentBlogPost>(`${this.apiUrl}/blog/posts/${id}`);
  }

  getCourses(): Observable<ContentCourse[]> {
    return this.http.get<ContentCourse[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: string): Observable<ContentCourse> {
    return this.http.get<ContentCourse>(`${this.apiUrl}/courses/${id}`);
  }

  getInternships(): Observable<ContentInternship[]> {
    return this.http.get<ContentInternship[]>(`${this.apiUrl}/internships`);
  }

  getInternshipById(id: string): Observable<ContentInternship> {
    return this.http.get<ContentInternship>(`${this.apiUrl}/internships/${id}`);
  }

  getFAQs(): Observable<ContentFaq[]> {
    return this.http.get<ContentFaq[]>(`${this.apiUrl}/help/faqs`);
  }

  subscribeNewsletter(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/newsletter/subscribe`, { email });
  }
}
