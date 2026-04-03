import { Injectable, signal } from '@angular/core';

export type FreelancerRequest = {
  id: string;
  employerId?: string;
  employerName?: string;
  employerEmail: string;
  freelancerName?: string | null;
  freelancerId?: string | null;
  description: string;
  message?: string;
  skills: string[];
  duration?: string | null;
  status: 'pending' | 'approved' | 'assigned' | 'rejected' | 'completed';
  createdAt?: string;
  contactUnlocked?: boolean;
};

@Injectable({ providedIn: 'root' })
export class FreelancerRequestService {
  private _requests = signal<FreelancerRequest[]>([]);
  requests = this._requests;

  create(payload: Omit<FreelancerRequest, 'id' | 'status'>) {
    const id = Date.now().toString();
    const req: FreelancerRequest = { ...payload, id, status: 'pending', createdAt: new Date().toISOString(), contactUnlocked: false } as FreelancerRequest;
    this._requests.update(r => [req, ...r]);
    return req;
  }

  list() {
    return this._requests();
  }

  updateStatus(id: string, status: FreelancerRequest['status']) {
    this._requests.update(r => r.map(req => req.id === id ? { ...req, status } : req));
  }

  assignFreelancer(requestId: string, freelancerId: string) {
    this._requests.update(r => r.map(req => req.id === requestId ? { ...req, freelancerId, status: 'approved', contactUnlocked: true } : req));
  }

  setFreelancerName(requestId: string, freelancerName: string) {
    this._requests.update(r => r.map(req => req.id === requestId ? { ...req, freelancerName } : req));
  }

  pendingCount(): number {
    return this._requests().filter(req => req.status === 'pending').length;
  }
}
