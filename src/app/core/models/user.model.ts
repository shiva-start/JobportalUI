export type UserRole = 'candidate' | 'employer' | 'admin' | 'freelancer';
export type RegisterRole = 'Candidate' | 'Employer' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  title?: string;
  location?: string;
  phone?: string;
  bio?: string;
  isFreelancer?: boolean;
  accountStatus?: 'active' | 'inactive' | 'blocked';
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RegisterRole;
  companyName?: string;
  industry?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  expiresAtUtc: string;
}
