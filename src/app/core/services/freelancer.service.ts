import { Injectable, signal } from '@angular/core';
import { FreelancerProfile } from '../../models';

@Injectable({ providedIn: 'root' })
export class FreelancerService {
  private _freelancers = signal<FreelancerProfile[]>([
    { id: 'f1', name: 'Aisha Khan',    role: 'Frontend Developer',    type: 'Freelancer', status: 'approved', skills: ['Angular','TypeScript','UI Design'],      description: 'Building responsive, accessible UIs with modern frameworks.', portfolio: 'aisha.dev', experience: '6 years' },
    { id: 'f2', name: 'Omar Rizvi',    role: '.NET Developer',        type: 'Freelancer', status: 'approved', skills: ['.NET','C#','REST APIs'],                 description: 'Robust API development and scalable backend solutions.', portfolio: 'omar.codes', experience: '8 years' },
    { id: 'f3', name: 'Lina Ahmed',    role: 'UX/UI Designer',        type: 'Freelancer', status: 'approved', skills: ['Figma','UX Research','Prototyping'],     description: 'Designing intuitive product experiences that delight users.', portfolio: 'behance.net/lina', experience: '5 years' },
    { id: 'f4', name: 'Samir Patel',   role: 'Full-Stack Developer',  type: 'Freelancer', status: 'approved', skills: ['Node.js','Angular','PostgreSQL'],        description: 'End-to-end web applications from database to deployment.', portfolio: 'samir.dev', experience: '7 years' },
    { id: 'f5', name: 'Priya Sharma',  role: 'Data Analyst',          type: 'Freelancer', status: 'approved', skills: ['Python','Power BI','SQL'],               description: 'Turning raw data into actionable business insights.', portfolio: 'priya-analytics.com', experience: '4 years' },
    { id: 'f6', name: 'Zaid Hassan',   role: 'Mobile Developer',      type: 'Freelancer', status: 'pending',  skills: ['Flutter','Dart','Firebase'],             description: 'Cross-platform mobile apps for iOS and Android.', portfolio: 'zaidapps.dev', experience: '3 years' },
  ]);

  freelancers = this._freelancers;

  list() {
    return this._freelancers();
  }

  getById(id: string) {
    return this._freelancers().find(f => f.id === id) || null;
  }

  activeCount(): number {
    return this._freelancers().filter(f => f.status === 'approved').length;
  }

  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    this._freelancers.update(list => list.map(f => f.id === id ? { ...f, status } : f));
  }

  assignFreelancerToRequest(freelancerId: string, requestId: string) {
    // In this mock service, just update a field on freelancer to show assignment
    this._freelancers.update(list => list.map(f => f.id === freelancerId ? { ...f, assignedRequest: requestId } : f));
  }
}
