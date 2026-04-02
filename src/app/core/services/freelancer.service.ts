import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FreelancerService {
  private _freelancers = signal<any[]>([
    { id: 'f1', name: 'Aisha Khan', role: 'Frontend Developer', type: 'Freelancer', status: 'approved', skills: ['Angular','TypeScript','UI Design'], description: 'Building responsive, accessible UIs.' },
    { id: 'f2', name: 'Omar Rizvi', role: '.NET Developer', type: 'Freelancer', status: 'pending', skills: ['.NET','C#','APIs'], description: 'API development and backend solutions.' },
    { id: 'f3', name: 'Lina Ahmed', role: 'UX/UI Designer', type: 'Freelancer', status: 'approved', skills: ['Figma','UX','Prototyping'], description: 'Designing intuitive product experiences.' },
    { id: 'f4', name: 'Samir Patel', role: 'Full-stack Developer', type: 'Freelancer', status: 'rejected', skills: ['Node.js','Angular','Postgres'], description: 'End-to-end web applications.' }
  ]);

  freelancers = this._freelancers;

  list() {
    return this._freelancers();
  }

  getById(id: string) {
    return this._freelancers().find(f => f.id === id) || null;
  }

  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    this._freelancers.update(list => list.map(f => f.id === id ? { ...f, status } : f));
  }

  assignFreelancerToRequest(freelancerId: string, requestId: string) {
    // In this mock service, just update a field on freelancer to show assignment
    this._freelancers.update(list => list.map(f => f.id === freelancerId ? { ...f, assignedRequest: requestId } : f));
  }
}
