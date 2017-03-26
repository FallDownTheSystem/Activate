import { Filter } from '../../model/filter';
import { ActivityActions } from '../../store/actions/activity.actions';
import { User } from '../../model/user';
import { Component, OnInit, OnDestroy, HostListener, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Activity } from '../../model/activity';
import { AppStore } from '../../store/app-store';
import '../../rxjs-extensions';

@Component({
	selector: 'act-activity-card',
	templateUrl: './activity-card.component.html',
	styleUrls: ['./activity-card.component.scss'],
	animations: [
		trigger('entry', [
			transition('void => *', [
				animate(100, keyframes([
					style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
					style({opacity: 1, transform: 'translateX(0)', offset: 1}),
				]))
			])
		]),
		trigger('select', [
			transition('void => *', [
				animate(150, keyframes([
					style({transform: 'translateX(-70%) scale(0.3)', offset: 0}),
					style({transform: 'translateX(0) scale(1)', offset: 1}),
				]))
			]),
			transition('* => void', [
				animate(150, keyframes([
					style({opacity: 1, transform: 'translateX(0) scale(1)', offset: 0}),
					style({opacity: 0, transform: 'translateX(-70%) scale(0.3)', offset: 0.8}),
					style({opacity: 0, transform: 'translateX(-70%) scale(0)', offset: 1}),
				]))
			]),
			transition('* => *', [
				animate(300, keyframes([
					style({opacity: 1, transform: 'scale(1)', offset: 0}),
					style({opacity: 0, transform: 'scale(0.3)', offset: 0.3}),
					style({opacity: 1, transform: 'scale(1)', offset: 1}),
				]))
			])
		]),
		trigger('select-mobile', [
			transition('void => *', [
				animate(100, keyframes([
					style({opacity: 0.2, transform: 'scaleY(0.6)', offset: 0}),
					style({opacity: 1, transform: 'scaleY(1)', offset: 1}),
				]))
			])
		]),
		trigger('select-mobile-out', [/*
			transition('void => *', [
				animate(50, keyframes([
					style({opacity: 0.2, offset: 0}),
					style({opacity: 1, offset: 1}),
				]))
			])
		*/]),
		trigger('mobile', [
			state('mobile', style({
				width: '100%',
				maxWidth: '100%'
			})),
			state('desktop', style({
				width: '45%'
			})),
			transition('desktop <=> mobile', [
				animate(300)
			])
		])
	]
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
	filteredSub: any;
	actKey: string;

	@HostListener('window:resize') onResize() {
		this.mobileView = window.innerWidth <= 850;
		this.view = this.mobileView ? 'mobile' : 'desktop';
	}

	constructor(private store: Store<AppStore>,
							private activityActions: ActivityActions) {
		this.activitiesObs = store.select(s => s.activities);
		this.filterObs = store.select(s => s.activityFilter);
	}

	ngOnInit() {
		this.filteredSub = this.activitiesObs.combineLatest(this.filterObs, this.filterAndSortActivities)
			.subscribe(activities => this.activities = activities);

		this.userSub = this.store.select(s => s.user).subscribe(user => this.user = user);

		this.onResize();
	}

	ngOnDestroy() {
		if (this.userSub) {
			this.userSub.unsubscribe();
		}
	}

	select(i) {
		if (this.selectedActivity === this.activities[i]) {
			this.selectedActivity = null;
		} else {
			this.selectedActivity = this.activities[i];
		}
	}

	favorite(event) {
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

	filterAndSortActivities(activities, filter) {
		const filteredActivities = activities.filter(activity => { // Credit for filtering logic to Cas

			// Get dates to check if activity is older than current date
			const actDate = new Date(activity.date);
			actDate.setDate(actDate.getDate() + 1);
			const curDate = new Date();
			// console.log(curDate, ' : ', actDate, actDate > curDate);
			return !filter ||
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
}
