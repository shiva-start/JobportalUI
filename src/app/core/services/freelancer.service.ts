import { Injectable, signal } from '@angular/core';
import { FreelancerProfile } from '../../models';

@Injectable({ providedIn: 'root' })
export class FreelancerService {
  private _freelancers = signal<FreelancerProfile[]>([
    {
      id: 'f1',
      name: '',
      nameKey: 'FREELANCERS.CARD.NAMES.AISHA_KHAN',
      role: '',
      roleKey: 'FREELANCERS.CARD.ROLES.FRONTEND_DEVELOPER',
      type: '',
      typeKey: 'FREELANCERS.CARD.TYPES.FREELANCER',
      status: 'approved',
      skills: ['Angular', 'TypeScript', 'UI Design'],
      skillKeys: ['FREELANCERS.CARD.SKILLS.ANGULAR', 'FREELANCERS.CARD.SKILLS.TYPESCRIPT', 'FREELANCERS.CARD.SKILLS.UI_DESIGN'],
      description: '',
      descriptionKey: 'FREELANCERS.CARD.DESCRIPTIONS.FRONTEND_DEVELOPER',
      portfolio: 'aisha.dev',
      experience: '6 years'
    },
    {
      id: 'f2',
      name: '',
      nameKey: 'FREELANCERS.CARD.NAMES.OMAR_RIZVI',
      role: '',
      roleKey: 'FREELANCERS.CARD.ROLES.DOTNET_DEVELOPER',
      type: '',
      typeKey: 'FREELANCERS.CARD.TYPES.FREELANCER',
      status: 'approved',
      skills: ['.NET', 'C#', 'REST APIs'],
      skillKeys: ['FREELANCERS.CARD.SKILLS.DOTNET', 'FREELANCERS.CARD.SKILLS.C_SHARP', 'FREELANCERS.CARD.SKILLS.REST_APIS'],
      description: '',
      descriptionKey: 'FREELANCERS.CARD.DESCRIPTIONS.DOTNET_DEVELOPER',
      portfolio: 'omar.codes',
      experience: '8 years'
    },
    {
      id: 'f3',
      name: '',
      nameKey: 'FREELANCERS.CARD.NAMES.LINA_AHMED',
      role: '',
      roleKey: 'FREELANCERS.CARD.ROLES.UX_UI_DESIGNER',
      type: '',
      typeKey: 'FREELANCERS.CARD.TYPES.FREELANCER',
      status: 'approved',
      skills: ['Figma', 'UX Research', 'Prototyping'],
      skillKeys: ['FREELANCERS.CARD.SKILLS.FIGMA', 'FREELANCERS.CARD.SKILLS.UX_RESEARCH', 'FREELANCERS.CARD.SKILLS.PROTOTYPING'],
      description: '',
      descriptionKey: 'FREELANCERS.CARD.DESCRIPTIONS.UX_UI_DESIGNER',
      portfolio: 'behance.net/lina',
      experience: '5 years'
    },
    {
      id: 'f4',
      name: '',
      nameKey: 'FREELANCERS.CARD.NAMES.SAMIR_PATEL',
      role: '',
      roleKey: 'FREELANCERS.CARD.ROLES.FULL_STACK_DEVELOPER',
      type: '',
      typeKey: 'FREELANCERS.CARD.TYPES.FREELANCER',
      status: 'approved',
      skills: ['Node.js', 'Angular', 'PostgreSQL'],
      skillKeys: ['FREELANCERS.CARD.SKILLS.NODE_JS', 'FREELANCERS.CARD.SKILLS.ANGULAR', 'FREELANCERS.CARD.SKILLS.POSTGRESQL'],
      description: '',
      descriptionKey: 'FREELANCERS.CARD.DESCRIPTIONS.FULL_STACK_DEVELOPER',
      portfolio: 'samir.dev',
      experience: '7 years'
    },
    {
      id: 'f5',
      name: '',
      nameKey: 'FREELANCERS.CARD.NAMES.PRIYA_SHARMA',
      role: '',
      roleKey: 'FREELANCERS.CARD.ROLES.DATA_ANALYST',
      type: '',
      typeKey: 'FREELANCERS.CARD.TYPES.FREELANCER',
      status: 'approved',
      skills: ['Python', 'Power BI', 'SQL'],
      skillKeys: ['FREELANCERS.CARD.SKILLS.PYTHON', 'FREELANCERS.CARD.SKILLS.POWER_BI', 'FREELANCERS.CARD.SKILLS.SQL'],
      description: '',
      descriptionKey: 'FREELANCERS.CARD.DESCRIPTIONS.DATA_ANALYST',
      portfolio: 'priya-analytics.com',
      experience: '4 years'
    },
    {
      id: 'f6',
      name: '',
      nameKey: 'FREELANCERS.CARD.NAMES.ZAID_HASSAN',
      role: '',
      roleKey: 'FREELANCERS.CARD.ROLES.MOBILE_DEVELOPER',
      type: '',
      typeKey: 'FREELANCERS.CARD.TYPES.FREELANCER',
      status: 'pending',
      skills: ['Flutter', 'Dart', 'Firebase'],
      skillKeys: ['FREELANCERS.CARD.SKILLS.FLUTTER', 'FREELANCERS.CARD.SKILLS.DART', 'FREELANCERS.CARD.SKILLS.FIREBASE'],
      description: '',
      descriptionKey: 'FREELANCERS.CARD.DESCRIPTIONS.MOBILE_DEVELOPER',
      portfolio: 'zaidapps.dev',
      experience: '3 years'
    },
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
