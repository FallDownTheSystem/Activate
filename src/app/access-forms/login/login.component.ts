import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { Router } from '@angular/router';
import { AppStore } from '../../store/app-store';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
	selector: 'act-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	forgot: boolean;
	signinForm: FormGroup;
	forgotPasswordForm: FormGroup;

	constructor(private fb: FormBuilder,
							private location: Location,
							private store: Store<AppStore>,
							private af: AngularFire,
							private router: Router) {
		this.forgot = false;
	}

	ngOnInit() {
		this.signinForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
			}
		);

		this.forgotPasswordForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
			}
		);
	}

	// Sign in
	onSigninSubmit() {
		this.af.auth.login({
			email: this.signinForm.get('email').value,
			password: this.signinForm.get('password').value
		}, {
			method: AuthMethods.Password
		}).then((user: FirebaseAuthState) => {
			// Success
			this.router.navigate(['/home']);
		}, (error: Error) => {
			// Error
			console.log(error);
		});
	}

	// Forgot password
	onForgotPasswordSubmit() {
		firebase.auth().sendPasswordResetEmail(this.forgotPasswordForm.get('email').value)
		.then((a: any) => {
			console.log(a);
		},
		(error: Error) => {
			console.log(error);
		});
	}

	googleLogin() {
		this.af.auth.login({
			provider: AuthProviders.Google,
			method: AuthMethods.Popup
		});
	}

	goBack(): void {
		this.location.back();
	}
}
