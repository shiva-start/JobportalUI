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
  moderationStatus?: 'approved' | 'pending' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  avatar?: string;
  company?: string;
  title?: string;
  location?: string;
  bio?: string;
  isFreelancer?: boolean;
  accountStatus?: 'active' | 'inactive' | 'blocked';
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

export type ApplicationStatus =
  | 'applied'
  | 'under-review'
  | 'shortlisted'
  | 'interview-scheduled'
  | 'rejected'
  | 'selected';

export interface ApplicationRecord {
  jobId: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startYear: number;
  endYear: number | string;
  grade?: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
}

export interface RecruiterMessage {
  id: string;
  from: string;
  company: string;
  avatar: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

export interface CandidateResume {
  name: string;
  uploadedAt: string;
  sizeLabel: string;
}

export interface CandidateProfile {
  userId: string;
  headline: string;
  phone: string;
  location: string;
  about: string;
  profilePicture?: string;
  skills: string[];
  education: Education[];
  experience: WorkExperience[];
  certifications: Certification[];
  resume: CandidateResume | null;
  visibility: boolean;
}

export interface CandidateNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  category: 'job-alert' | 'application-update' | 'message' | 'profile';
  actionLabel?: string;
  actionRoute?: string;
}

export interface CandidateActivity {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface FreelancerProfile {
  id: string;
  name: string;
  role: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  skills: string[];
  description: string;
  portfolio?: string;
  experience?: string;
  assignedRequest?: string;
}

export interface PlatformReport {
  id: string;
  type: 'content' | 'user' | 'job' | 'spam';
  subject: string;
  status: 'open' | 'reviewed' | 'resolved';
  createdAt: string;
}
