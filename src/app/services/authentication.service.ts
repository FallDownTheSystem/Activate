import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { AuthProviders, FirebaseAuthState } from 'angularfire2';

import { AppStore } from '../store/app-store';
import { LoginComponent } from '../components/access-forms/login/login.component';
import { UserActions } from '../store/actions/user.actions';
import { UIStateActions } from '../store/actions/ui-state.action';

import { User } from '../model/user';


@Injectable()
export class AuthenticationService {
	constructor(private store: Store<AppStore>,
							private userActions: UserActions,
							public af: AngularFire,
							public router: Router,
							private uiStateActions: UIStateActions) {

	this.af.auth.subscribe(user => {
			if (user) {
				// user logged in
				// console.log(user);
				// console.log(user.auth.displayName + ':' + user.auth.email);
				this.store.dispatch(this.userActions.loginSuccess(new User(user)));
				this.router.navigate(['/home']);
			} else {
				// user not logged in
				this.store.dispatch(this.userActions.logoff());
			}
		});
	}

	getUserRoles(user: User): Observable<User> {
	return this.af.database.object('/users/' + user.userId + '/roles')
					.take(1)
					.map(roles => {
						user.roles = roles;
						return user;
					});
}

	ensureLogin = function() {
		if (!this.isAuthenticated) {
			console.log('ensureLogin');
			this.router.navigate(['/access']);
		}
	};

	showLogin = function(url?: string) {
		this.store.dispatch(this.uiStateActions.setLoginRedirectUrl(url));
		this.router.navigate(['/access']);
	};

	logout = function() {
		this.af.auth.logout();
	};

	get isAuthenticated(): boolean {
		let user: User;
		this.store.take(1).subscribe(s => user = s.user);
		if (user) {
			return true;
		}
		return false;
	};

	get user(): User {
		let user: User;
		this.store.take(1).subscribe(s => user = s.user);
		return user;
	};
}
