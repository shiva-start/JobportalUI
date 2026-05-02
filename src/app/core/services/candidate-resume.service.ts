import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface CandidateResume {
  userId: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  viewUrl: string;
  downloadUrl: string;
}

@Injectable({ providedIn: 'root' })
export class CandidateResumeService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  uploadResume(file: File): Observable<CandidateResume> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<CandidateResume, FormData>('candidate/upload-resume', formData);
  }

  getResume(): Observable<CandidateResume> {
    return this.api.get<CandidateResume>('candidate/get-resume');
  }

  downloadResume(): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/candidate/download-resume`, { responseType: 'blob' });
  }
}

