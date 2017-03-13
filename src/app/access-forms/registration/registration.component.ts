import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import * as firebase from 'firebase';
import { AngularFire, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppStore } from '../../store/app-store';
import { UserActions } from '../../store/actions/user.actions';
import { User } from '../../model/user';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
	selector: 'act-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

	signupForm: FormGroup;


	constructor(private location: Location,
							private fb: FormBuilder,
							private store: Store<AppStore>,
							private af: AngularFire,
							private router: Router,
							private userActions: UserActions) { }

	goBack(): void {
		this.location.back();
	}

	ngOnInit() {
		this.signupForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			username: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
			}, {validator: signupFormValidator}
		);
	}

	// Register
	onSignupSubmit() {
		this.af.auth.createUser({
			email: this.signupForm.get('email').value,
			password: this.signupForm.get('password').value
		}).then((user: FirebaseAuthState) => {
			// Success
			user.auth.updateProfile({
				displayName: this.signupForm.get('username').value,
				photoURL: ''
			}).then(() => {
			// Success
			this.store.dispatch(this.userActions.userUpdated(new User(user)));
			this.router.navigate(['/home']);
		}, (error: Error) => {
			// Error
			console.log(error);
		});
		}, (error: Error) => {
			// Error
			console.log(error);
		});
	}
}

function signupFormValidator(fg: FormGroup): {[key: string]: boolean} {
// TODO: check if email is already taken

// Password match validation
if (fg.get('password').value !== fg.get('confirmPassword').value) {
	return {'passwordmismatch': true};
}
	return null;
}
