import { Injectable, signal } from '@angular/core';

export type FreelancerRequest = {
  id: string;
  employerEmail: string;
  freelancerId?: string | null;
  description: string;
  skills: string[];
  duration?: string | null;
  status: 'pending' | 'assigned' | 'rejected' | 'completed';
};

@Injectable({ providedIn: 'root' })
export class FreelancerRequestService {
  private _requests = signal<FreelancerRequest[]>([]);
  requests = this._requests;

  create(payload: Omit<FreelancerRequest, 'id' | 'status'>) {
    const id = Date.now().toString();
    const req: FreelancerRequest = { ...payload, id, status: 'pending' } as FreelancerRequest;
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
    this._requests.update(r => r.map(req => req.id === requestId ? { ...req, freelancerId, status: 'assigned' } : req));
  }
}
