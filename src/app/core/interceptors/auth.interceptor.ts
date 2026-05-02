import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

const AUTH_PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);
  const isBrowser = isPlatformBrowser(platformId);
  const apiBase = environment.apiBaseUrl.replace(/\/+$/, '');
  const isApiRequest = req.url.startsWith(apiBase);
  const isPublicAuthRequest = AUTH_PUBLIC_ENDPOINTS.some((path) => req.url.includes(path));

  const token = authService.getToken();
  const authReq = token && isApiRequest
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldHandleUnauthorized = isBrowser && isApiRequest && !isPublicAuthRequest && error.status === 401;
      if (shouldHandleUnauthorized) {
        authService.clearSession();
        void router.navigateByUrl('/');
      }
      const shouldHandleForbidden = isBrowser && isApiRequest && !isPublicAuthRequest && error.status === 403;
      if (shouldHandleForbidden) {
        if (authService.isAuthenticated()) {
          void router.navigateByUrl(authService.getDashboardRoute());
        } else {
          void router.navigateByUrl('/');
        }
      }
      return throwError(() => error);
    })
  );
};
