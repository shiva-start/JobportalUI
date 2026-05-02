import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export type QueryParams = Record<
  string,
  string | number | boolean | Date | null | undefined | Array<string | number | boolean | Date>
>;

export interface ApiRequestOptions {
  params?: QueryParams;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  constructor(private readonly http: HttpClient) {}

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(endpoint), {
        params: this.buildHttpParams(options?.params),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  post<T, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: ApiRequestOptions
  ): Observable<T> {
    return this.http
      .post<T>(this.buildUrl(endpoint), body, {
        params: this.buildHttpParams(options?.params),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  put<T, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: ApiRequestOptions
  ): Observable<T> {
    return this.http
      .put<T>(this.buildUrl(endpoint), body, {
        params: this.buildHttpParams(options?.params),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  patch<T, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: ApiRequestOptions
  ): Observable<T> {
    return this.http
      .patch<T>(this.buildUrl(endpoint), body, {
        params: this.buildHttpParams(options?.params),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  delete<T, TBody = unknown>(
    endpoint: string,
    options?: ApiRequestOptions & { body?: TBody }
  ): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(endpoint), {
        body: options?.body,
        params: this.buildHttpParams(options?.params),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private buildUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.apiBaseUrl}/${normalizedEndpoint}`;
  }

  private buildHttpParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((arrayValue) => {
          httpParams = httpParams.append(key, this.serializeQueryValue(arrayValue));
        });
        return;
      }

      httpParams = httpParams.set(key, this.serializeQueryValue(value));
    });

    return httpParams;
  }

  private serializeQueryValue(value: string | number | boolean | Date): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}

