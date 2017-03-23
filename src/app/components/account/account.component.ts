import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import '../../rxjs-extensions';

import { Category } from '../../model/category';
import { Activity } from '../../model/activity';
import { ActivityActions } from '../../store/actions/activity.actions';
import { AppStore } from '../../store/app-store';
import { User } from '../../model/user';


@Component({
	selector: 'act-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

	subscription2: any;
	user: User;
	view: string = 'account';
	accountForm: FormGroup;
	passwordForm: FormGroup;

	constructor(private fb: FormBuilder,
							private router: Router,
							private store: Store<AppStore>) { 
		this.subscription2 = store.select(s => s.user).subscribe(user => {
			this.user = user;
			if (!user) {
				this.router.navigate(['/home']);
			}
		});
	}

	ngOnInit() {
	}

	editAccount() {
		this.view = 'editAccount';
		this.accountForm = this.fb.group({
			displayName: this.user.displayName,
			email: this.user.email
		});
	}

	editPassword() {
		this.view = 'editPassword';
		this.passwordForm = this.fb.group({
			newPass: '',
			newPass2: '',
			currentPass: ''
		});
	}

	cancel() {
		this.view = 'account';
	}

	onAccountSubmit() {

	}

	onPasswordSubmit() {

	}

}
