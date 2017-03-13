import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { Store } from '@ngrx/store';
import '../rxjs-extensions';

import { AuthProviders, FirebaseAuthState } from 'angularfire2';

import { AppStore } from '../store/app-store';
import { LoginComponent } from '../access-forms/login/login.component';
import { UserActions } from '../store/actions/user.actions';

import { User } from '../model/user';


@Injectable()
export class AuthenticationService {
	constructor(private store: Store<AppStore>,
							private userActions: UserActions,
							public af: AngularFire,
							public router: Router) {

	this.af.auth.subscribe(user => {
			if (user) {
				// user logged in
				console.log(user);
				console.log(user.auth.displayName + ':' + user.auth.email);
				this.store.dispatch(this.userActions.loginSuccess(new User(user)));
			} else {
				// user not logged in
				this.store.dispatch(this.userActions.logoff());
			}
		});
	}

	ensureLogin = function() {
		if (!this.isAuthenticated) {
			console.log('ensureLogin');
			this.router.navigate(['/access']);
		}
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
