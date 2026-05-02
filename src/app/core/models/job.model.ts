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

export interface JobsFilters {
  keyword?: string;
  location?: string;
  category?: string;
  experienceLevel?: string;
  type?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'posted' | 'salary';
  descending?: boolean;
}

export interface JobsListResponse {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateJobPayload {
  companyId: string;
  jobCategoryId: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  minSalary?: number | null;
  maxSalary?: number | null;
  employmentType?: string;
  experienceLevel?: string | null;
  deadlineUtc?: string | null;
  skills: string[];
  requirements: string[];
}

export interface UpdateJobPayload extends CreateJobPayload {
  status?: string;
}
