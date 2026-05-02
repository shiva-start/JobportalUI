import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface ToggleSavedJobResponse {
  jobId: string;
  isSaved: boolean;
}

@Injectable({ providedIn: 'root' })
export class SavedJobsService {
  private readonly api = inject(ApiService);

  toggleSaveJob(jobId: string): Observable<ToggleSavedJobResponse> {
    return this.api.post<ToggleSavedJobResponse, Record<string, never>>(`savedjobs/${jobId}/toggle`, {});
  }

  getSavedJobIds(): Observable<string[]> {
    return this.api.get<string[]>('savedjobs');
  }
}
