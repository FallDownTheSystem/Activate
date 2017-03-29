import { Favorite } from '../../model/favorite';
import { UserActions } from '../../store/actions/user.actions';
import { Subscription } from 'rxjs/Rx';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { Filter } from '../../model/filter';
import { ActivityActions } from '../../store/actions/activity.actions';
import { User } from '../../model/user';
import { Component, OnInit, OnDestroy, HostListener, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Activity } from '../../model/activity';
import { AppStore } from '../../store/app-store';
import '../../rxjs-extensions';
import { animations } from './animations';

@Component({
	selector: 'act-activity-card',
	templateUrl: './activity-card.component.html',
	styleUrls: ['./activity-card.component.scss'],
	animations: [animations]
})


export class ActivityCardComponent implements OnDestroy {
	activities: Activity[];
	activitiesObs: Observable<Activity[]>;
	filterObs: Observable<Filter>;
	filteredActivitiesObs: Observable<Activity[]>;
	selectedActivity: Activity;
	mobileView: boolean;
	view: string;
	user: User;
	userSub: any;
	userObs: Observable<User>;
	filteredSub: any;
	actKey: string;
	showComments = false;
	dialogRef: MdDialogRef<any>;
	dialogResult: any;
	disableFavorite = false;
	favoritesObs: Observable<Favorite[]>;
	favSub: Subscription;
	favorites: Favorite[];
	removed = false;

	@HostListener('window:resize') onResize() {
		this.mobileView = window.innerWidth <= 850;
		this.view = this.mobileView ? 'mobile' : 'desktop';
	}

	constructor(private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private userActions: UserActions,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef) {
		this.userObs = store.select(s => s.user);
		this.favoritesObs = store.select(s => s.favorites);
		this.activitiesObs = store.select(s => s.activities);
		this.filterObs = store.select(s => s.activityFilter);
	}

	ngOnInit() {
		this.userSub = this.userObs.subscribe(user => this.user = user);
		this.favSub = this.favoritesObs.subscribe(favorites => this.favorites = favorites);
		this.filteredSub = this.activitiesObs.combineLatest(this.filterObs, this.userObs,
			(activities: Activity[], filter: any, user: User) => this.filterAndSortActivities(activities, filter, user)) // Cas saves the day <3
			.subscribe(activities => this.activities = activities);
		this.onResize();
	}

	openDialog() {
		const config = new MdDialogConfig();
		config.viewContainerRef = this.viewContainerRef;
		this.dialogRef = this.dialog.open(PrivateMessageComponent, config);
		this.dialogRef.componentInstance.userIdParam = this.selectedActivity.created_uid;
		this.dialogRef.componentInstance.usernameParam = this.selectedActivity.organizer;

		this.dialogRef.afterClosed().subscribe(result => {
			// console.log('result', result);
			this.dialogResult = result;
		});
	}

	select(i, listItem, page) {
		/*
			These variables may be used in the future to set mobile screen position
			when expanding / collapsing elements would cause clicked item to go out of screen
		*/
		// We can either remember that comments should be shown, or hide comments when selecting a new activity
		this.showComments = false;
		if (this.selectedActivity === this.activities[i]) {
			this.selectedActivity = null;
		} else {
			this.selectedActivity = null; // set to null before selecting anyways to clear comments and shiz
			this.selectedActivity = this.activities[i];
		}
		/*
		if (this.mobileView) {
			setTimeout(() => {
				listItem.scrollIntoView();
				page.scrollTop -= 20;
			}, 100)
		}
		*/
	}

	stopProp(event) {
		event.stopPropagation();
	}

	deleteActivity() {
		if (this.selectedActivity.created_uid === this.user.userId) {
			this.store.dispatch(this.activityActions.deleteActivity(this.selectedActivity['$key']));
			this.selectedActivity = null;
		} else {
			console.error('activity does not belong to you.');
		}
	}

	addFavorite(activity: Activity) {
		this.removed = false;
		if (this.user) {
			this.favorites.map(favorite => {
				if (activity['$key'] === favorite.activityID) {
					this.store.dispatch(this.userActions.deleteFavorite(favorite['$key']));
					this.removed = true;
				}
			});
			if (!this.removed) {
				this.store.dispatch(this.userActions.addFavorite(activity['$key']));
			}
		}
	}

	isFavorite(activity: Activity): boolean {
		if (this.user) {
			return this.favorites.some(favorite => activity['$key'] === favorite.activityID);
		}
		return false;
	}

	// .forEach(x => x.activityID.includes(activity['$key']))) {
	// 			this.store.dispatch(this.userActions.deleteFavorite(activity['$key']));
	// 		} else {
	// 			this.store.dispatch(this.userActions.deleteFavorite(activity['$key']));
	// 		}


	filterAndSortActivities(activities: Activity[], filter: any, user: User) {
		const filteredActivities = activities.filter(activity => { // Credit for filtering logic to Cas

			// Get dates to check if activity is older than current date
			const actDate = new Date(activity.date);
			actDate.setDate(actDate.getDate() + 1);
			const curDate = new Date();
			// console.log(curDate, ' : ', actDate, actDate > curDate);
			// console.log(filter.own, activity.created_uid, user);
			// console.log(activity.favorites);
			return !filter ||
							(!filter.favorite || !user || this.isFavorite(activity)) &&
							(!filter.own || !user || activity.created_uid === user.userId ) &&
							(!activity.date || actDate > curDate) &&
							(!filter.category || filter.category.category === '' || activity.category.category === filter.category.category) &&
							(!filter.order || filter.order !== 'distance' || activity.geoloc) &&
							(!activity.geoloc || !filter.distance || !filter.geoloc || filter.distance === 0 || filter.geoloc.distance(activity.geoloc) < filter.distance) &&
							(!filter.search || filter.search === '' ||
							(activity.description && activity.description.toLowerCase().includes(filter.search.toLowerCase())) ||
							(activity.location && activity.location.toLowerCase().includes(filter.search.toLowerCase())) ||
							(activity.organizer && activity.organizer.toLowerCase().includes(filter.search.toLowerCase())) ||
							(activity.subtitle && activity.subtitle.toLowerCase().includes(filter.search.toLowerCase())) ||
							(activity.tags && (activity.tags && activity.tags.reduce((acc, value) => acc || value.toLowerCase().includes(filter.search.toLowerCase()), false))) ||
							(activity.title && activity.title.toLowerCase().includes(filter.search.toLowerCase())));
		});

		switch (filter.order) {
			case 'distance':
				return filteredActivities.sort((a, b) => {
					if (filter.geoloc.distance(a.geoloc) < filter.geoloc.distance(b.geoloc)) {
						return -1;
					} else if (filter.geoloc.distance(a.geoloc) > filter.geoloc.distance(b.geoloc)) {
							return 1;
					} else {
						return 0;
					}
				});
			case 'latest':
				return filteredActivities.sort((a, b) => {
					if (a.createdOn < b.createdOn) {
						return -1;
					} else if (a.createdOn > b.createdOn) {
							return 1;
					} else {
						return 0;
					}
				});
			case 'upcoming':
				return filteredActivities.sort((a, b) => {
					if (a.date < b.date) {
						return -1;
					} else if (a.date > b.date) {
							return 1;
					} else {
						return 0;
					}
				});
			default:
				return filteredActivities;
		}
	}

	truncate(i): boolean {
		return !(this.selectedActivity === this.activities[i] && this.mobileView);
	}

	ngOnDestroy() {
		if (this.userSub) {
			this.userSub.unsubscribe();
		}
	}
}
