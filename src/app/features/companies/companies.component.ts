import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Header & Search -->
      <div class="mb-10 text-center max-w-2xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Discover Top <span class="text-blue-600">Companies</span></h1>
        <p class="text-slate-500 text-lg mb-8">Find the best places to work and research employers that match your career goals.</p>

        <div class="relative max-w-lg mx-auto">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input type="text" [(ngModel)]="searchQuery"
                 class="block w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm"
                 placeholder="Search by company name or industry...">
        </div>
      </div>

      <!-- Companies Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (company of filteredCompanies; track company.id) {
          <div class="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border border-slate-100 shadow-sm"
                   [ngClass]="company.colorClass">
                {{ company.name.charAt(0) }}
              </div>
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                {{ company.industry }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{{ company.name }}</h3>
            
            <div class="flex items-center gap-1 mt-1.5 text-sm text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ company.location }}</span>
            </div>

            <p class="text-slate-600 text-sm mt-4 line-clamp-2 flex-grow">{{ company.description }}</p>

            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span class="font-medium text-slate-700">{{ company.openJobs }} Open Jobs</span>
              <span class="text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                View
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
        }

        @if (filteredCompanies.length === 0) {
          <div class="col-span-full py-12 text-center text-slate-500">
            <div class="w-16 h-16 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-lg font-medium text-slate-700">No companies found</p>
            <p class="mt-1">Try adjusting your search to find what you're looking for.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class CompaniesComponent {
  searchQuery = '';

  companies = [
    { id: 'c1', name: 'TechFlow', industry: 'Software', location: 'San Francisco, CA', description: 'Building the next generation of seamless workflow automation tools for modern teams.', openJobs: 12, colorClass: 'bg-blue-50 text-blue-600' },
    { id: 'c2', name: 'Global Health', industry: 'Healthcare', location: 'New York, NY', description: 'Innovative health tech solutions bridging the gap between patients and medical professionals.', openJobs: 8, colorClass: 'bg-emerald-50 text-emerald-600' },
    { id: 'c3', name: 'FinTrust', industry: 'Fintech', location: 'London, UK', description: 'Democratizing algorithmic trading and secure asset management for everyday users.', openJobs: 4, colorClass: 'bg-indigo-50 text-indigo-600' },
    { id: 'c4', name: 'CloudScale', industry: 'Cloud Ops', location: 'Austin, TX', description: 'Enterprise cloud infrastructure simplified. We help scale businesses securely.', openJobs: 15, colorClass: 'bg-sky-50 text-sky-600' },
    { id: 'c5', name: 'DesignHub', industry: 'Agency', location: 'Berlin, DE', description: 'Award-winning creative agency focused on digital experiences and brand identity.', openJobs: 3, colorClass: 'bg-rose-50 text-rose-600' },
    { id: 'c6', name: 'EduSphere', industry: 'EdTech', location: 'Remote', description: 'Accessible online learning platforms that empower students globally.', openJobs: 6, colorClass: 'bg-amber-50 text-amber-600' },
    { id: 'c7', name: 'AutoDrive AI', industry: 'Automotive', location: 'Detroit, MI', description: 'Pioneering autonomous vehicle software using advanced neural networks.', openJobs: 22, colorClass: 'bg-slate-100 text-slate-600' },
    { id: 'c8', name: 'GreenEnergy', industry: 'Cleantech', location: 'Denver, CO', description: 'Renewable energy solutions focusing on smart grid optimization and solar integration.', openJobs: 9, colorClass: 'bg-green-50 text-green-600' }
  ];

  get filteredCompanies() {
    if (!this.searchQuery) return this.companies;
    const query = this.searchQuery.toLowerCase();
    return this.companies.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.industry.toLowerCase().includes(query)
    );
  }
}
