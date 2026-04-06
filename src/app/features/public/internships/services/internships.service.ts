import { Injectable, signal } from '@angular/core';
import { Internship } from '../../../../models';

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 'int-1', title: 'Frontend Developer Intern', company: 'Stripe', companyLogo: 'ST',
    location: 'Bangalore, India', locationType: 'Hybrid', duration: '3 months',
    stipend: 20000, stipendCurrency: 'INR', startDate: '2026-05-01',
    skills: ['Angular', 'TypeScript', 'Tailwind CSS'],
    description: 'Join the Stripe frontend team and work on production-grade web interfaces used by millions of merchants.',
    requirements: ['Currently pursuing B.Tech / B.E in CS or related', 'Familiar with any frontend framework', 'Strong problem-solving skills'],
    openings: 3, category: 'Engineering', postedAt: '2026-04-01', deadline: '2026-04-20',
  },
  {
    id: 'int-2', title: 'Data Science Intern', company: 'Notion', companyLogo: 'NO',
    location: 'Remote', locationType: 'Remote', duration: '6 months',
    stipend: 25000, stipendCurrency: 'INR', startDate: '2026-06-01',
    skills: ['Python', 'Pandas', 'Machine Learning', 'SQL'],
    description: "Work alongside our data team to build models that improve Notion's recommendation and search features.",
    requirements: ['Pursuing M.Sc / B.Tech in Data Science or Statistics', 'Proficient in Python', 'Exposure to ML frameworks'],
    openings: 2, category: 'Data Science', postedAt: '2026-04-02', deadline: '2026-04-25',
  },
  {
    id: 'int-3', title: 'UI/UX Design Intern', company: 'Figma', companyLogo: 'FI',
    location: 'San Francisco, CA', locationType: 'Onsite', duration: '3 months',
    stipend: null, stipendCurrency: 'USD', startDate: '2026-07-01',
    skills: ['Figma', 'Prototyping', 'User Research'],
    description: 'Help shape the future of collaborative design at Figma. You will work directly with senior designers on real product features.',
    requirements: ['Portfolio demonstrating strong design thinking', 'Proficiency in Figma', 'Understanding of usability principles'],
    openings: 1, category: 'Design', postedAt: '2026-04-03', deadline: '2026-05-01',
  },
  {
    id: 'int-4', title: 'Backend Engineering Intern', company: 'Vercel', companyLogo: 'VE',
    location: 'Remote', locationType: 'Remote', duration: '6 months',
    stipend: 30000, stipendCurrency: 'INR', startDate: '2026-05-15',
    skills: ['Node.js', 'PostgreSQL', 'REST APIs', 'Docker'],
    description: "Work on the backend infrastructure powering Vercel's edge network and deployment pipelines.",
    requirements: ['Strong understanding of Node.js', 'Experience with databases', 'Familiarity with cloud services'],
    openings: 2, category: 'Engineering', postedAt: '2026-04-04', deadline: '2026-04-28',
  },
  {
    id: 'int-5', title: 'Marketing Intern', company: 'HubSpot', companyLogo: 'HS',
    location: 'Chennai, India', locationType: 'Hybrid', duration: '3 months',
    stipend: 12000, stipendCurrency: 'INR', startDate: '2026-05-01',
    skills: ['Content Writing', 'SEO', 'Social Media', 'Analytics'],
    description: "Join HubSpot's APAC marketing team to drive inbound campaigns and content strategies targeting the SMB market.",
    requirements: ['Excellent written communication', 'Familiarity with SEO basics', 'Creative thinking'],
    openings: 4, category: 'Marketing', postedAt: '2026-04-05', deadline: '2026-04-22',
  },
  {
    id: 'int-6', title: 'Product Management Intern', company: 'Atlassian', companyLogo: 'AT',
    location: 'Hyderabad, India', locationType: 'Onsite', duration: '6 months',
    stipend: 22000, stipendCurrency: 'INR', startDate: '2026-06-01',
    skills: ['Product Thinking', 'Jira', 'Agile', 'Data Analysis'],
    description: 'Support product managers in defining and shipping features for Jira and Confluence used by enterprise customers.',
    requirements: ['Strong analytical skills', 'Passion for software products', 'Good communication skills'],
    openings: 2, category: 'Product', postedAt: '2026-04-06', deadline: '2026-05-05',
  },
];

export interface InternshipFilter {
  search: string;
  locationType: string;
  duration: string;
  stipend: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class InternshipsService {
  private internships = signal<Internship[]>(MOCK_INTERNSHIPS);

  getAll(): Internship[] {
    return this.internships();
  }

  getFiltered(filter: InternshipFilter): Internship[] {
    return this.internships().filter(i => {
      if (filter.search && !i.title.toLowerCase().includes(filter.search.toLowerCase()) && !i.company.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.locationType && i.locationType !== filter.locationType) return false;
      if (filter.duration && i.duration !== filter.duration) return false;
      if (filter.category && i.category !== filter.category) return false;
      if (filter.stipend === 'paid' && !i.stipend) return false;
      if (filter.stipend === 'unpaid' && i.stipend !== null) return false;
      return true;
    });
  }

  getById(id: string): Internship | undefined {
    return this.internships().find(i => i.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.internships().map(i => i.category))];
  }
}
