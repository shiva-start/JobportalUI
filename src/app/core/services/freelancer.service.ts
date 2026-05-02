import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { FreelancerProfile } from '../../models';
import { ApiService } from './api.service';

type FreelancerDirectoryApiDto = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  type: string;
  status: string;
  description?: string | null;
  portfolio?: string | null;
  availability?: string | null;
  hourlyRate: number;
  skills: string[];
};

@Injectable({ providedIn: 'root' })
export class FreelancerService {
  private readonly api = inject(ApiService);

  private readonly _freelancers = signal<FreelancerProfile[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly freelancers = this._freelancers.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.loadFreelancers().subscribe();
  }

  loadFreelancers(): Observable<FreelancerProfile[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.get<FreelancerDirectoryApiDto[]>('freelancer').pipe(
      map((items) => items.map((item) => this.mapApi(item))),
      tap((items) => this._freelancers.set(items)),
      catchError((error) => {
        this._error.set(error?.message || 'Failed to load freelancers.');
        return of(this._freelancers());
      }),
      tap(() => this._loading.set(false)),
    );
  }

  list() {
    return this._freelancers();
  }

  getById(id: string) {
    return this._freelancers().find((f) => f.id === id) || null;
  }

  activeCount(): number {
    return this._freelancers().filter((f) => f.status === 'approved').length;
  }

  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    this._freelancers.update((list) => list.map((f) => (f.id === id ? { ...f, status } : f)));
  }

  assignFreelancerToRequest(freelancerId: string, requestId: string) {
    this._freelancers.update((list) => list.map((f) => (f.id === freelancerId ? { ...f, assignedRequest: requestId } : f)));
  }

  private mapApi(dto: FreelancerDirectoryApiDto): FreelancerProfile {
    return {
      id: dto.id,
      name: dto.name,
      role: dto.role || 'Freelancer',
      type: dto.type || 'Freelancer',
      status: (dto.status?.toLowerCase() as FreelancerProfile['status']) || 'approved',
      skills: dto.skills || [],
      description: dto.description || 'Freelancer profile',
      portfolio: dto.portfolio || undefined,
      experience: dto.hourlyRate ? `$${dto.hourlyRate}/hr` : undefined,
    };
  }
}
