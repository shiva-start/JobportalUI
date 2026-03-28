export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  featured?: boolean;
  category: string;
  applicants?: number;
  views?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer';
  avatar?: string;
  company?: string;
  title?: string;
  location?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export interface JobFilter {
  keyword: string;
  location: string;
  category: string;
  experienceLevel: string;
  type: string;
}

export interface AppliedJob {
  jobId: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface SavedJob {
  jobId: string;
  savedAt: string;
}
