import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company, CreateCompanyPayload, UpdateCompanyPayload } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class CompaniesService {
  private readonly api = inject(ApiService);

  getCompanies(): Observable<Company[]> {
    return this.api.get<Company[]>('companies');
  }

  getCompanyById(id: string): Observable<Company> {
    return this.api.get<Company>(`companies/${id}`);
  }

  getMyCompany(): Observable<Company> {
    return this.api.get<Company>('companies/mine');
  }

  createCompany(payload: CreateCompanyPayload): Observable<Company> {
    return this.api.post<Company, CreateCompanyPayload>('companies', payload);
  }

  updateCompany(id: string, payload: UpdateCompanyPayload): Observable<Company> {
    return this.api.put<Company, UpdateCompanyPayload>(`companies/${id}`, payload);
  }

  deleteCompany(id: string): Observable<void> {
    return this.api.delete<void>(`companies/${id}`);
  }
}
