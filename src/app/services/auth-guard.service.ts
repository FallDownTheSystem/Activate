import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(private authService: AuthenticationService) {

	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (!this.authService.isAuthenticated){
			this.authService.showLogin(state.url);
			return false;
		}
		return true;
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivate(route, state);
	}
}