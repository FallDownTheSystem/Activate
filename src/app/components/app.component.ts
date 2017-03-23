import { Component, OnInit, Input, OnDestroy, AfterContentChecked } from '@angular/core';
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';

import { AppStore } from './../store/app-store';
import { CategoryActions } from './../store/actions/category.actions';
import { ActivityActions } from './../store/actions/activity.actions';
import { AuthenticationService } from './../services/authentication.service';
import { User } from './../model/user';

@Component({
	selector: 'act-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
	title = 'Activate!';
	subscription: any;
	subscription2: any;
	subscription3: any;
	subscription4: any;
	user: User;
	mobileView: boolean = false;

	@ViewChild('toolbarContainer') elementView: ElementRef;
	viewHeight: number;

	@HostListener('window:resize') onResize() {
		this.viewHeight = this.elementView.nativeElement.offsetHeight;
		this.mobileView = false;
		if (window.innerWidth < 850) this.mobileView = true;
		// console.log(this.viewHeight);
	}

	constructor(private authService: AuthenticationService,
							private categoryActions: CategoryActions,
							private activityActions: ActivityActions,
							private router: Router,
							private store: Store<AppStore>,
							public snackBar: MdSnackBar) {

		// Subscribe to all the different status updates and open a snackbar reflecting a succeful status
		// TODO: refactor status reducer to encompass all statuses.
		this.subscription = store.select(s => s.activitySaveStatus).subscribe((status) => {
			if (status === 'SUCCESS') {
				this.snackBar.open('New activity saved!', 'OK', {duration: 2000});
			}
			if (status === 'IN PROGRESS') {
				this.router.navigate(['/home']);
			}
		});

		this.subscription3 = store.select(s => s.activityUpdateStatus).subscribe((status) => {
			if (status === 'SUCCESS') {
				this.snackBar.open('Activity updated!', 'OK', {duration: 2000});
			}
			if (status === 'IN PROGRESS') {
				this.router.navigate(['/home']);
			}
		});

		this.subscription4 = store.select(s => s.activityDeleteStatus).subscribe((status) => {
			if (status === 'SUCCESS') {
				this.snackBar.open('Activity deleted!', 'OK', {duration: 2000});
			}
			if (status === 'IN PROGRESS') {
				this.router.navigate(['/home']);
			}
		});

		this.subscription2 = store.select(s => s.user).subscribe(user => {
			this.user = user;
			if (user) {
				// Set user coordinates if logged in
				let url: string;
				this.store.take(1).subscribe(s => url = s.loginRedirectUrl);
				if (url) {
					this.router.navigate([url]);
				}
			}
		});
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

	ngAfterContentChecked() {
		this.onResize();
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.subscription2) {
			this.subscription2.unsubscribe();
		}
		if (this.subscription3) {
			this.subscription3.unsubscribe();
		}
	}

}
