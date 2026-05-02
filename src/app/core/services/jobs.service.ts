import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  CreateJobPayload,
  Job,
  JobsFilters,
  JobsListResponse,
  UpdateJobPayload,
} from '../models/job.model';

interface JobDto {
  id: string;
  companyId: string;
  companyName: string;
  jobCategoryId: string;
  jobCategoryName: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  minSalary: number | null;
  maxSalary: number | null;
  employmentType: string;
  experienceLevel: string | null;
  status: string;
  postedAtUtc: string;
  skills: string[];
  requirements: string[];
}

interface JobSearchDto {
  items: JobDto[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly api = inject(ApiService);

  getJobs(filters: JobsFilters = {}): Observable<JobsListResponse> {
    const categoryValue = (filters.category ?? '').trim();
    const isCategoryGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(categoryValue);

    return this.api.get<JobSearchDto>('jobs', {
      params: {
        search: filters.keyword,
        location: filters.location,
        category: !isCategoryGuid ? categoryValue : undefined,
        categoryId: isCategoryGuid ? categoryValue : undefined,
        experienceLevel: filters.experienceLevel,
        employmentType: filters.type,
        isRemote: filters.type === 'remote' ? true : undefined,
        sortBy: filters.sortBy ?? 'posted',
        descending: filters.descending ?? true,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10,
      },
    }).pipe(
      map((response) => ({
        items: response.items.map((item) => this.mapJobDto(item)),
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      })),
    );
  }

  getJobById(id: string): Observable<Job> {
    return this.api.get<JobDto>(`jobs/${id}`).pipe(
      map((dto) => this.mapJobDto(dto)),
    );
  }

  createJob(payload: CreateJobPayload): Observable<Job> {
    return this.api.post<JobDto, CreateJobPayload>('jobs', payload).pipe(
      map((dto) => this.mapJobDto(dto)),
    );
  }

  updateJob(id: string, payload: UpdateJobPayload): Observable<Job> {
    return this.api.put<JobDto, UpdateJobPayload>(`jobs/${id}`, payload).pipe(
      map((dto) => this.mapJobDto(dto)),
    );
  }

  deleteJob(id: string): Observable<void> {
    return this.api.delete<void>(`jobs/${id}`);
  }

  applyToJob(id: string): Observable<void> {
    return this.api.post<void, Record<string, never>>(`jobs/${id}/apply`, {});
  }

  saveJob(id: string): Observable<void> {
    return this.api.post<void, Record<string, never>>(`jobs/${id}/save`, {});
  }

  unsaveJob(id: string): Observable<void> {
    return this.api.delete<void>(`jobs/${id}/save`);
  }

  getRelatedJobs(id: string): Observable<Job[]> {
    return this.api.get<JobDto[]>(`jobs/${id}/related`).pipe(
      map((items) => items.map((item) => this.mapJobDto(item))),
    );
  }

  private mapJobDto(dto: JobDto): Job {
    const type = dto.isRemote ? 'remote' : this.mapEmploymentType(dto.employmentType);

    return {
      id: dto.id,
      title: dto.title,
      company: dto.companyName || 'Company',
      location: dto.isRemote ? 'Remote' : dto.location,
      type,
      experienceLevel: this.mapExperienceLevel(dto.experienceLevel),
      salary: this.formatSalary(dto.minSalary, dto.maxSalary),
      description: dto.description,
      requirements: dto.requirements ?? [],
      skills: dto.skills ?? [],
      postedAt: dto.postedAtUtc,
      category: dto.jobCategoryName || 'General',
    };
  }

  private mapExperienceLevel(level: string | null): Job['experienceLevel'] {
    const normalized = (level ?? '').toLowerCase();
    if (normalized === 'entry') return 'entry';
    if (normalized === 'mid') return 'mid';
    if (normalized === 'senior') return 'senior';
    if (normalized === 'lead') return 'lead';
    if (normalized === 'executive') return 'executive';
    return 'mid';
  }

  private mapEmploymentType(type: string): Job['type'] {
    const normalized = (type || '').toLowerCase();
    if (normalized === 'fulltime' || normalized === 'full-time') return 'full-time';
    if (normalized === 'parttime' || normalized === 'part-time') return 'part-time';
    if (normalized === 'contract') return 'contract';
    if (normalized === 'internship') return 'internship';
    if (normalized === 'remote') return 'remote';
    return 'full-time';
  }

  private formatSalary(minSalary: number | null, maxSalary: number | null): string | undefined {
    if (minSalary === null && maxSalary === null) {
      return undefined;
    }

    if (minSalary !== null && maxSalary !== null) {
      return `$${Math.round(minSalary).toLocaleString()} - $${Math.round(maxSalary).toLocaleString()}`;
    }

    if (minSalary !== null) {
      return `From $${Math.round(minSalary).toLocaleString()}`;
    }

    return `Up to $${Math.round(maxSalary as number).toLocaleString()}`;
  }
}
