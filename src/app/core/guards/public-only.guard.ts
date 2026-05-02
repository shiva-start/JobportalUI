import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, timeout } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PublicOnlyGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.initializeAuth().pipe(
      timeout(9000),
      catchError(() => of(void 0)),
      map(() => (this.auth.isAuthenticated() ? this.router.parseUrl(this.auth.getDashboardRoute()) : true)),
    );
  }
}
