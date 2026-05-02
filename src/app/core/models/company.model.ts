export interface Company {
  id: string;
  userId?: string;
  name: string;
  description?: string | null;
  location?: string | null;
  industry?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CreateCompanyPayload {
  name: string;
  description?: string | null;
  location?: string | null;
  industry?: string | null;
}

export interface UpdateCompanyPayload extends CreateCompanyPayload {}
