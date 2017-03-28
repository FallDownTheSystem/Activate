import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import '../../rxjs-extensions';
import * as firebase from 'firebase';
import { Category } from '../../model/category';
import { Activity } from '../../model/activity';
import { ActivityActions } from '../../store/actions/activity.actions';
import { AppStore } from '../../store/app-store';
import { User } from '../../model/user';
import { MdSnackBar } from '@angular/material';


const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
	selector: 'act-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent {
	userSub: any;
	user: User;
	view = 'account';
	usernameForm: FormGroup;
	emailForm: FormGroup;
	passwordForm: FormGroup;
	deleteForm: FormGroup;
	passwordsMatch = true;

	constructor(private fb: FormBuilder,
							private router: Router,
							private store: Store<AppStore>,
							public snackBar: MdSnackBar) {
		this.userSub = store.select(s => s.user).subscribe(user => {
			this.user = user;
			if (!user) {
				this.router.navigate(['/home']);
			}
		});
	}

	ngOnInit() {
	}

	editUsername() {
		this.view = 'editUsername';
		this.usernameForm = this.fb.group({
			displayName: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
		});
	}

	editEmail() {
		this.view = 'editEmail';
		this.emailForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
			oldPass: ['', Validators.required]
		});
	}

	editPassword() {
		this.view = 'editPassword';
		this.passwordForm = this.fb.group({
			newPass: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			newPass2: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			oldPass: ['', Validators.required]
		});
	}

	deleteAccount() {
		this.view = 'deleteAccount';
		this.deleteForm = this.fb.group({
			confirm: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
			oldPass: ['', Validators.required]
		});
	}

	cancel() {
		this.view = '';
	}

	onUsernameSubmit() {
		const user = firebase.auth().currentUser;
		user.updateProfile({
		displayName: this.usernameForm.get('displayName').value,
		photoURL: null
		}).then(_ => {
			this.snackBar.open('Username updated succesfully.', 'OK', {duration: 3000});
		}, error => {
			this.snackBar.open(error.message, 'OK', {duration: 10000});
		});
		this.usernameForm.reset();
	}

	onEmailSubmit() {
		const user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, this.emailForm.get('oldPass').value);

		user.reauthenticate(credential).then(function() {
			// User re-authenticated.
		}, function(error) {
			// An error happened.
		});

		user.updateEmail(this.emailForm.get('email').value).then(_ => {
			this.snackBar.open('Email updated succesfully.', 'OK', {duration: 3000});
		}, error => {
			this.snackBar.open(error.message, 'OK', {duration: 10000});
		});
	this.emailForm.reset();
	}

	onPasswordSubmit() {
		const user = firebase.auth().currentUser;
		const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, this.passwordForm.get('oldPass').value);

		user.reauthenticate(credential).then(function() {
			// User re-authenticated.
		}, function(error) {
			// An error happened.
		});

		if (this.passwordForm.get('newPass').value === this.passwordForm.get('newPass2').value) {
			this.passwordsMatch = true;
			user.updatePassword(this.passwordForm.get('newPass').value).then(_ => {
				this.snackBar.open('Password updated succesfully.', 'OK', {duration: 3000});
			}, error => {
				this.snackBar.open(error.message, 'OK', {duration: 10000});
			});
		} else {
			this.passwordsMatch = false;
			console.error('Passwords don\'t match.');
		}
		this.passwordForm.reset();
	}

	onDeleteSubmit() {
		if (this.deleteForm.get('confirm').value === 'DELETE') {
			const user = firebase.auth().currentUser;
			const credential = firebase.auth.EmailAuthProvider.credential(this.user.email, this.deleteForm.get('oldPass').value);

			user.reauthenticate(credential).then(function() {
				// User re-authenticated.
			}, function(error) {
				// An error happened.
			});

				user.delete().then(_ => {
					this.snackBar.open('Account deleted succesfully.', 'OK', {duration: 3000});
				}, error => {
					this.snackBar.open(error.message, 'OK', {duration: 10000});
				});

			this.deleteForm.reset();
		}
	}

	getProfilePicture() {
		if (this.user.authState.google !== undefined) {
			return this.user.authState.google.photoURL;
		} else if (this.user.authState.facebook !== undefined) {
			return this.user.authState.facebook.photoURL;
		} else {
			return 'https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_account_circle_white_24px.svg'
		}
	}
}
