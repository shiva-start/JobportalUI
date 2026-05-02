import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from './api.service';

export type CandidateFreelancerRequest = {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  bio?: string | null;
  portfolioUrl?: string | null;
  hourlyRate?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string | null;
  adminRemarks?: string | null;
  note?: string;
};

@Injectable({ providedIn: 'root' })
export class CandidateFreelancerRequestService {
  private readonly api = inject(ApiService);
  private _requests = signal<CandidateFreelancerRequest[]>([]);
  requests = this._requests;

  constructor() {
    this.loadMyRequests().subscribe();
  }

  loadMyRequests(): Observable<CandidateFreelancerRequest[]> {
    return this.api.get<FreelancerUpgradeRequestApiDto[]>('freelancer-requests').pipe(
      map((items) => items.map((item) => this.mapApi(item))),
      tap((items) => this._requests.set(items)),
      catchError(() => of(this._requests())),
    );
  }

  loadAdminRequests(): Observable<CandidateFreelancerRequest[]> {
    return this.api.get<FreelancerUpgradeRequestApiDto[]>('admin/freelancer-requests').pipe(
      map((items) => items.map((item) => this.mapApi(item))),
      tap((items) => this._requests.set(items)),
      catchError(() => of(this._requests())),
    );
  }

  create(request: { bio?: string | null; portfolioUrl?: string | null; hourlyRate?: number }): Observable<CandidateFreelancerRequest> {
    return this.api.post<FreelancerUpgradeRequestApiDto, CreateFreelancerUpgradeRequestApiRequest>('freelancer-requests', {
      bio: request.bio ?? null,
      portfolioUrl: request.portfolioUrl ?? null,
      hourlyRate: request.hourlyRate ?? 0,
    }).pipe(
      map((item) => this.mapApi(item)),
      tap((item) => this._requests.update((items) => [item, ...items.filter((x) => x.id !== item.id)])),
    );
  }

  list() {
    return this._requests();
  }

  approve(id: string): Observable<CandidateFreelancerRequest> {
    return this.api.post<FreelancerUpgradeRequestApiDto, Record<string, never>>(`admin/freelancer-requests/${id}/approve`, {}).pipe(
      map((item) => this.mapApi(item)),
      tap((item) => this._requests.update((items) => items.map((x) => x.id === id ? item : x))),
    );
  }

  reject(id: string, adminRemarks?: string): Observable<CandidateFreelancerRequest> {
    return this.api.post<FreelancerUpgradeRequestApiDto, { adminRemarks?: string }>(`admin/freelancer-requests/${id}/reject`, {
      adminRemarks: adminRemarks || undefined,
    }).pipe(
      map((item) => this.mapApi(item)),
      tap((item) => this._requests.update((items) => items.map((x) => x.id === id ? item : x))),
    );
  }

  findByUser(userId: string) {
    return this._requests().find(r => r.userId === userId) || null;
  }

  private mapApi(dto: FreelancerUpgradeRequestApiDto): CandidateFreelancerRequest {
    return {
      id: dto.id,
      userId: dto.userId,
      userName: dto.userName,
      userEmail: dto.userEmail,
      bio: dto.bio,
      portfolioUrl: dto.portfolioUrl,
      hourlyRate: dto.hourlyRate,
      status: dto.status.toLowerCase() as CandidateFreelancerRequest['status'],
      createdAt: dto.createdAtUtc,
      reviewedAt: dto.reviewedAtUtc,
      adminRemarks: dto.adminRemarks,
    };
  }
}

type CreateFreelancerUpgradeRequestApiRequest = {
  bio: string | null;
  portfolioUrl: string | null;
  hourlyRate: number;
};

type FreelancerUpgradeRequestApiDto = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bio: string | null;
  portfolioUrl: string | null;
  hourlyRate: number;
  status: string;
  adminRemarks: string | null;
  createdAtUtc: string;
  reviewedAtUtc: string | null;
};
