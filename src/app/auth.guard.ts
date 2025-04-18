import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuthentication();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuthentication();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.checkAuthentication();
  }

  private checkAuthentication(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
