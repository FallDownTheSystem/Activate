import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';

import { AppStore } from './store/app-store';
import { CategoryActions } from './store/actions/category.actions';
import { ActivityActions } from './store/actions/activity.actions';
import { AuthenticationService } from './services/authentication.service';
import { User } from './model/user';

@Component({
	selector: 'act-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'Activate!';
	subscription: any;
	subscription2: any;
	user: User;

	constructor(private authService: AuthenticationService,
							private categoryActions: CategoryActions,
							private activityActions: ActivityActions,
							private router: Router,
							private store: Store<AppStore>,
							public snackBar: MdSnackBar) {
		this.subscription = store.select(s => s.activitySaveStatus).subscribe((status) => {
			if (status === 'SUCCESS') {
				this.snackBar.open('New activity saved!', 'OK', {duration: 2000});
			}
			if (status === 'IN PROGRESS') {
				this.router.navigate(['/home']);
			}
		});

		this.subscription2 = store.select(s => s.user).subscribe(user => this.user = user);
	}

	login() {
		this.authService.ensureLogin();
	}

	logout() {
		this.authService.logout();
	}

	ngOnInit () {
		this.store.dispatch(this.categoryActions.loadCategories());
		this.store.dispatch(this.activityActions.loadActivities());
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
