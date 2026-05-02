import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, timeout } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.initializeAuth().pipe(
      timeout(9000),
      catchError(() => of(void 0)),
      map(() => (this.auth.isAuthenticated() ? true : this.router.parseUrl('/'))),
    );
  }
}
