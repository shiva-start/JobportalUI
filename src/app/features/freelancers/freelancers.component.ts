import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreelancerCardComponent } from '../../shared/components/freelancer-card/freelancer-card.component';

@Component({
  selector: 'app-freelancers',
  standalone: true,
  imports: [CommonModule, FreelancerCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h1 class="text-2xl md:text-3xl font-semibold text-slate-800">Browse Freelancers</h1>
      <p class="text-slate-500 mt-2">Find skilled professionals available for hire.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <app-freelancer-card *ngFor="let f of freelancers" [freelancer]="f"></app-freelancer-card>
      </div>
    </div>
  `
})
export class FreelancersComponent {
  freelancers = [
    { id: 'f1', name: 'Aisha Khan', role: 'Frontend Developer', type: 'Freelancer', skills: ['Angular','TypeScript','UI Design'], description: 'Building responsive, accessible UIs.' },
    { id: 'f2', name: 'Omar Rizvi', role: '.NET Developer', type: 'Freelancer', skills: ['.NET','C#','APIs'], description: 'API development and backend solutions.' },
    { id: 'f3', name: 'Lina Ahmed', role: 'UX/UI Designer', type: 'Freelancer', skills: ['Figma','UX','Prototyping'], description: 'Designing intuitive product experiences.' },
    { id: 'f4', name: 'Samir Patel', role: 'Full-stack Developer', type: 'Freelancer', skills: ['Node.js','Angular','Postgres'], description: 'End-to-end web applications.' }
  ];
}
