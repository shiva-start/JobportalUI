import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface JobApplicationDto {
  id: string;
  jobId: string;
  candidateUserId: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  status: string;
  appliedAtUtc: string;
}

export interface ApplyJobRequest {
  jobId: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
}

export interface UpdateApplicationStatusRequest {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly api = inject(ApiService);

  applyToJob(payload: ApplyJobRequest): Observable<JobApplicationDto> {
    return this.api.post<JobApplicationDto, ApplyJobRequest>('applications', payload);
  }

  getMyApplications(): Observable<JobApplicationDto[]> {
    return this.api.get<JobApplicationDto[]>('applications/my');
  }

  getEmployerApplications(): Observable<JobApplicationDto[]> {
    return this.api.get<JobApplicationDto[]>('applications/employer');
  }

  updateApplicationStatus(id: string, payload: UpdateApplicationStatusRequest): Observable<JobApplicationDto> {
    return this.api.patch<JobApplicationDto, UpdateApplicationStatusRequest>(`applications/${id}/status`, payload);
  }
}
