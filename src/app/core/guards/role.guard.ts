import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, timeout } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.auth.initializeAuth().pipe(
      timeout(9000),
      catchError(() => of(void 0)),
      map(() => {
        const required = route.data?.['role'] as string | undefined;
        const user = this.auth.currentUser();
        if (!required) {
          return true;
        }
        if (!user) {
          return this.router.parseUrl('/');
        }

        if (required === 'candidate' && (user.role === 'candidate' || user.role === 'freelancer')) {
          return true;
        }

        if (user.role !== required) {
          return this.router.parseUrl(this.auth.getDashboardRoute(user.role));
        }
        return true;
      }),
    );
  }
}
