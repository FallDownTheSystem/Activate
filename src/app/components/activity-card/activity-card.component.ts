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

	@HostListener('window:resize') onResize() {
		this.mobileView = window.innerWidth <= 850;
		this.view = this.mobileView ? 'mobile' : 'desktop';
	}

	constructor(private store: Store<AppStore>,
							private activityActions: ActivityActions,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef) {
		this.userObs = store.select(s => s.user);
		this.activitiesObs = store.select(s => s.activities);
		this.filterObs = store.select(s => s.activityFilter);

	}

	ngOnInit() {
		this.userSub = this.userObs.subscribe(user => this.user = user);
		this.filteredSub = this.activitiesObs.combineLatest(this.filterObs, this.userObs, this.filterAndSortActivities)
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

	// TODO: Uniform these favorited functions
	addFavorite(i: string) {
		const act = this.activities[i];
		console.log(act);
			if (act) {
			if (act.favorites) {
				if (act.favorites.includes(this.user.userId)) {
					const favIndex = act.favorites.findIndex(value => value === this.user.userId);
					act.favorites[favIndex] = null;
					this.store.dispatch(this.activityActions.updateActivity(act['$key'], act));
				} else {
					act.favorites.push(this.user.userId);
					this.store.dispatch(this.activityActions.updateActivity(act['$key'], act));
					console.log(act.favorites);
				}
			} else {
				act.favorites = [this.user.userId];
				this.store.dispatch(this.activityActions.updateActivity(act['$key'], act));
			}
		}
	}

	addSelectedFavorite(activity: Activity) {
		const act = activity;
			if (act) {
			if (act.favorites) {
				if (act.favorites.includes(this.user.userId)) {
					const favIndex = act.favorites.findIndex(value => value === this.user.userId);
					act.favorites[favIndex] = null;
					this.store.dispatch(this.activityActions.updateActivity(act['$key'], act));
				} else {
					act.favorites.push(this.user.userId);
					this.store.dispatch(this.activityActions.updateActivity(act['$key'], act));
				}
			} else {
				act.favorites = [this.user.userId];
				this.store.dispatch(this.activityActions.updateActivity(act['$key'], act));
			}
		}
	}

	isFavorited(activity: Activity): boolean {
		if (activity.favorites) {
			return activity.favorites.includes(this.user.userId);
		}
		return false;
	}

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
							(!filter.favorite || !user || (activity.favorites && activity.favorites.includes(user.userId))) &&
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
