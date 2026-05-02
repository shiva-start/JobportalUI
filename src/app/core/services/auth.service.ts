import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map, of, shareReplay, switchMap, tap, throwError, timeout } from 'rxjs';
import { ApiService } from './api.service';
import { MeResponseDto } from '../models/me-response.dto';
import { AuthResponseDto, LoginRequest, RegisterRequest, User, UserRole } from '../models/user.model';

type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  initialized: boolean;
}

export interface AppApiError {
  status: number;
  message: string;
}

const TOKEN_STORAGE_KEY = 'token';
const ROLE_STORAGE_KEY = 'user_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly authStateSubject = new BehaviorSubject<AuthState>({
    status: 'unknown',
    user: null,
    initialized: false,
  });

  private readonly _currentUser = signal<User | null>(null);
  private readonly _authStatus = signal<AuthStatus>('unknown');
  private readonly _initialized = signal(false);
  private initRequest$: Observable<void> | null = null;

  readonly authState$ = this.authStateSubject.asObservable();
  readonly currentUser = computed(() => this._currentUser());
  readonly authStatus = computed(() => this._authStatus());
  readonly isCandidate = computed(() => this._currentUser()?.role === 'candidate');
  readonly isCandidateOrFreelancer = computed(() => this._currentUser()?.role === 'candidate' || this._currentUser()?.role === 'freelancer');
  readonly isEmployer = computed(() => this._currentUser()?.role === 'employer');
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isFreelancer = computed(() => this._currentUser()?.role === 'freelancer' || this._currentUser()?.isFreelancer === true);
  readonly isInitialized = computed(() => this._initialized());

  initializeAuth(): Observable<void> {
    if (this._initialized()) {
      return of(void 0);
    }

    if (this.initRequest$) {
      return this.initRequest$;
    }

    const token = this.getToken();
    if (!token) {
      this.setAuthState('unauthenticated', null, true);
      return of(void 0);
    }
    if (this.isTokenExpired(token)) {
      this.clearSession();
      return of(void 0);
    }

    this.initRequest$ = this.fetchCurrentUser().pipe(
      timeout(8000),
      map(() => void 0),
      catchError(() => {
        this.clearSession();
        return of(void 0);
      }),
      finalize(() => {
        this.initRequest$ = null;
      }),
      shareReplay(1),
    );

    return this.initRequest$;
  }

  login(payload: LoginRequest): Observable<User> {
    return this.api.post<AuthResponseDto, LoginRequest>('auth/login', payload).pipe(
      catchError((error) => this.handleApiError(error)),
      tap((response) => this.setToken(response.token)),
      switchMap(() => this.fetchCurrentUser()),
      catchError((error) => this.handleApiError(error)),
    );
  }

  register(payload: RegisterRequest): Observable<User> {
    return this.api.post<AuthResponseDto, RegisterRequest>('auth/register', payload).pipe(
      catchError((error) => this.handleApiError(error)),
      tap((response) => this.setToken(response.token)),
      switchMap(() => this.fetchCurrentUser()),
      catchError((error) => this.handleApiError(error)),
    );
  }

  getCurrentUser(): Observable<User> {
    return this.fetchCurrentUser().pipe(
      catchError((error) => this.handleApiError(error)),
    );
  }

  logout(): Observable<void> {
    this.clearSession();
    return of(void 0);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  }

  clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
    this.setAuthState('unauthenticated', null, true);
  }

  getUserRole(): UserRole | null {
    return this._currentUser()?.role ?? null;
  }

  getDashboardRoute(role?: UserRole | null): string {
    const effectiveRole = role ?? this.getUserRole();

    if (effectiveRole === 'admin') {
      return '/admin/dashboard';
    }

    if (effectiveRole === 'employer') {
      return '/employer/dashboard';
    }

    return '/candidate/dashboard';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      return false;
    }

    return this._authStatus() === 'authenticated' || !this._initialized();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private fetchCurrentUser(): Observable<User> {
    return this.api.get<MeResponseDto>('users/me').pipe(
      map((dto) => this.mapMeDtoToUser(dto)),
      tap((user) => this.setAuthState('authenticated', user, true)),
      catchError((error) => {
        this.clearSession();
        return throwError(() => this.toApiError(error));
      }),
    );
  }

  private setToken(token: string): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  private setAuthState(status: AuthStatus, user: User | null, initialized: boolean): void {
    this._authStatus.set(status);
    this._currentUser.set(user);
    this._initialized.set(initialized);
    if (this.isBrowser) {
      if (user?.role) {
        localStorage.setItem(ROLE_STORAGE_KEY, user.role);
      } else if (status !== 'authenticated') {
        localStorage.removeItem(ROLE_STORAGE_KEY);
      }
    }
    this.authStateSubject.next({
      status,
      user,
      initialized,
    });
  }

  private mapMeDtoToUser(dto: MeResponseDto): User {
    const role = this.parseRole(dto.role);
    const fullName = `${dto.firstName} ${dto.lastName}`.trim();

    return {
      id: dto.id,
      name: fullName,
      email: dto.email,
      role,
      company: dto.companyName ?? undefined,
      title: dto.industry ?? undefined,
      phone: dto.phoneNumber ?? undefined,
      accountStatus: this.mapStatus(dto.status),
      isFreelancer: dto.isFreelancer ?? role === 'freelancer',
      avatar: this.getInitials(fullName || dto.email),
    };
  }

  private mapStatus(status: string): User['accountStatus'] {
    const normalized = status.toLowerCase();
    if (normalized === 'active' || normalized === 'inactive' || normalized === 'blocked') {
      return normalized;
    }
    return 'active';
  }

  private parseRole(role: string): UserRole {
    const normalized = role.toLowerCase();

    if (normalized === 'candidate' || normalized === 'employer' || normalized === 'admin' || normalized === 'freelancer') {
      return normalized;
    }

    throw new Error(`Unexpected role received from backend: "${role}"`);
  }

  private handleApiError(error: unknown): Observable<never> {
    return throwError(() => this.toApiError(error));
  }

  private toApiError(error: unknown): AppApiError {
    if (!(error instanceof HttpErrorResponse)) {
      return {
        status: 0,
        message: error instanceof Error ? error.message : 'An unexpected error occurred.',
      };
    }

    const message =
      error.error?.message ||
      error.error?.error ||
      error.error?.title ||
      (typeof error.error === 'string' ? error.error : '') ||
      error.message ||
      'Authentication request failed.';

    return {
      status: error.status,
      message,
    };
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return true;
      }

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(normalized)) as { exp?: number };
      if (!decoded.exp) {
        return false;
      }

      return decoded.exp <= Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }
}
