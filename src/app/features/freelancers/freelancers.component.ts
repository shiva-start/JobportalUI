import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FreelancerCardComponent } from '../../shared/components/freelancer-card/freelancer-card.component';

@Component({
  selector: 'app-freelancers',
  standalone: true,
  imports: [CommonModule, FormsModule, FreelancerCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h1 class="text-2xl md:text-3xl font-semibold text-slate-800">Browse Freelancers</h1>
      <p class="text-slate-500 mt-2">Browse approved freelancers. Request a freelancer and Admin will handle assignment.</p>

      <!-- Search / Filter -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 mt-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Search skills or role" [(ngModel)]="keyword" class="col-span-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" />
          <select [(ngModel)]="experience" class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
            <option value="">Experience Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
          <input type="text" placeholder="Location" [(ngModel)]="location" class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50" />
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Search</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        <app-freelancer-card *ngFor="let f of filteredFreelancers" [freelancer]="f"></app-freelancer-card>
      </div>
    </div>
  `
})
export class FreelancersComponent {
  freelancers = [
    { id: 'f1', name: 'Aisha Khan', role: 'Frontend Developer', type: 'Freelancer', status: 'approved', skills: ['Angular','TypeScript','UI Design'], description: 'Building responsive, accessible UIs.' },
    { id: 'f2', name: 'Omar Rizvi', role: '.NET Developer', type: 'Freelancer', status: 'pending', skills: ['.NET','C#','APIs'], description: 'API development and backend solutions.' },
    { id: 'f3', name: 'Lina Ahmed', role: 'UX/UI Designer', type: 'Freelancer', status: 'approved', skills: ['Figma','UX','Prototyping'], description: 'Designing intuitive product experiences.' },
    { id: 'f4', name: 'Samir Patel', role: 'Full-stack Developer', type: 'Freelancer', status: 'rejected', skills: ['Node.js','Angular','Postgres'], description: 'End-to-end web applications.' }
  ];

  // simple search state
  keyword = '';
  experience = '';
  location = '';
  availability = '';

  get approvedFreelancers() {
    return this.freelancers.filter(f => f.status === 'approved');
  }

  get filteredFreelancers() {
    return this.approvedFreelancers.filter(f => {
      const kw = this.keyword.toLowerCase();
      if (kw) {
        const inRole = (f.role || '').toLowerCase().includes(kw);
        const inSkills = (f.skills || []).join(' ').toLowerCase().includes(kw);
        if (!inRole && !inSkills) return false;
      }
      if (this.experience) {
        // no experience on mock items; skip
      }
      if (this.location) {
        if (!(((f as any).location||'').toLowerCase().includes(this.location.toLowerCase()))) return false;
      }
      if (this.availability) {
        // no availability field on mock items; skip
      }
      return true;
    });
  }
}
