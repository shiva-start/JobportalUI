import { Injectable, signal } from '@angular/core';

export type CandidateFreelancerRequest = {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  note?: string;
};

@Injectable({ providedIn: 'root' })
export class CandidateFreelancerRequestService {
  private _requests = signal<CandidateFreelancerRequest[]>([]);
  requests = this._requests;

  create(userId: string, note?: string) {
    const id = Date.now().toString();
    const req: CandidateFreelancerRequest = { id, userId, status: 'pending', createdAt: new Date().toISOString(), note };
    this._requests.update(r => [req, ...r]);
    return req;
  }

  list() {
    return this._requests();
  }

  updateStatus(id: string, status: CandidateFreelancerRequest['status']) {
    this._requests.update(r => r.map(req => req.id === id ? { ...req, status } : req));
  }

  findByUser(userId: string) {
    return this._requests().find(r => r.userId === userId) || null;
  }
}
