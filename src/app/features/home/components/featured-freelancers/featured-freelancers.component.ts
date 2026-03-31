import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FreelancerCardComponent } from '../../../../shared/components/freelancer-card/freelancer-card.component';

@Component({
  selector: 'app-featured-freelancers',
  standalone: true,
  imports: [CommonModule, RouterLink, FreelancerCardComponent],
  template: `
    <section class="py-16 md:py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-3 text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">Featured Freelancers</h2>
          <p class="text-slate-600 text-base max-w-2xl mx-auto">Connect with skilled professionals ready to bring your projects to life</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          <app-freelancer-card [freelancer]="freelancers[0]"></app-freelancer-card>
          <app-freelancer-card [freelancer]="freelancers[1]"></app-freelancer-card>
          <app-freelancer-card [freelancer]="freelancers[2]"></app-freelancer-card>
        </div>

        <div class="flex justify-center mt-12">
          <a routerLink="/freelancers" class="inline-flex items-center gap-2 px-6 py-3 text-blue-600 font-semibold text-sm bg-white border border-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            Browse All Freelancers
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `
})
export class FeaturedFreelancersComponent {
  freelancers = [
    { id: 'f1', name: 'Aisha Khan', role: 'Frontend Developer', type: 'Freelancer', skills: ['Angular','TypeScript','UI Design'], description: 'Building responsive, accessible UIs.' },
    { id: 'f2', name: 'Omar Rizvi', role: '.NET Developer', type: 'Freelancer', skills: ['.NET','C#','APIs'], description: 'API development and backend solutions.' },
    { id: 'f3', name: 'Lina Ahmed', role: 'UX/UI Designer', type: 'Freelancer', skills: ['Figma','UX','Prototyping'], description: 'Designing intuitive product experiences.' }
  ];
}
