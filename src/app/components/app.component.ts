import { AboutComponent } from './about/about.component';
import { UserActions } from '../store/actions/user.actions';
import { UpperCasePipe } from '@angular/common/src/pipes/case_conversion_pipes';
import { Component, OnInit, Input, OnDestroy, AfterContentChecked } from '@angular/core';
import { ElementRef, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar, MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
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

export class AppComponent implements OnDestroy, AfterContentChecked {
	title = 'Activate!';
	subscription: any;
	subscription2: any;
	subscription3: any;
	user: User;
	mobileView = false;
	isDarkTheme = false;
	entryDone = false; // Container animation
	dialogRef: MdDialogRef<any>;

	@ViewChild('toolbarContainer') elementView: ElementRef;
	viewHeight: number;

	@HostListener('window:resize') onResize() {
		this.viewHeight = this.elementView.nativeElement.offsetHeight;
		this.mobileView = false;
		if (window.innerWidth < 850) {
			this.mobileView = true;
		}
		// console.log(this.viewHeight);
	}

	constructor(private authService: AuthenticationService,
							private categoryActions: CategoryActions,
							private activityActions: ActivityActions,
							private userActions: UserActions,
							private router: Router,
							private store: Store<AppStore>,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef,
							public snackBar: MdSnackBar) {

		this.subscription = store.select(s => s.activityStatus).subscribe((status) => {
			if (status.includes('Activity successfully')) {
				this.snackBar.open(status, 'OK', {duration: 2000});
			}
			if (status === 'IN PROGRESS') {
				this.router.navigate(['/home']);
			}
		});

		this.subscription3 = store.select(s => s.favoriteStatus).subscribe((status) => {
			if (status.includes('Favorite successfully')) {
				this.snackBar.open(status, 'OK', {duration: 2000});
			}
		});

		this.subscription2 = store.select(s => s.user).subscribe(user => {
			this.user = user;
			if (user) {
				this.store.dispatch(this.userActions.loadFavorites());
				// Set user coordinates if logged in
				let url: string;
				this.store.take(1).subscribe(s => url = s.loginRedirectUrl);
				if (url) {
					this.router.navigate([url]);
				}
			}
		});
	}

	ngOnInit () {
		this.store.dispatch(this.categoryActions.loadCategories());
		this.store.dispatch(this.activityActions.loadActivities());

		setTimeout(() => {
			// remove animation class after init
			this.entryDone = true;
		}, 2000);
	}

	login() {
		this.authService.ensureLogin();
	}

	logout() {
		this.authService.logout();
	}


	redirhome() {
		this.router.navigate(['/home']);
	}

	ngAfterContentChecked() {
		this.onResize();
	}

	showAddButton() {
		return this.user && this.router.url !== '/new-activity';
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

	openAbout() {
		const config = new MdDialogConfig();
		config.viewContainerRef = this.viewContainerRef;
		this.dialogRef = this.dialog.open(AboutComponent, config);
	}

}
