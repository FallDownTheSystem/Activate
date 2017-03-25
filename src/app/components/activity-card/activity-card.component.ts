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
		this.filteredSub = this.activitiesObs.combineLatest(
			this.filterObs, (activities, filter) => {
				return activities.filter(activity => { // Credit for filtering logic to Cas
					return (filter == null) ||
									(filter.category == null || filter.category.category === '' || activity.category.category === filter.category.category) &&
									(activity.geoloc == null || filter.distance == null || filter.distance === 0 || filter.geoloc.distance(activity.geoloc) < filter.distance) &&
									(filter.search == null || filter.search === '' ||
									(activity.description != null && activity.description.toLowerCase().includes(filter.search.toLowerCase())) ||
									(activity.location != null && activity.location.toLowerCase().includes(filter.search.toLowerCase())) ||
									(activity.organizer != null && activity.organizer.toLowerCase().includes(filter.search.toLowerCase())) ||
									(activity.subtitle != null && activity.subtitle.toLowerCase().includes(filter.search.toLowerCase())) ||
									(activity.tags != null && (activity.tags && activity.tags.reduce((acc, value) => acc || value.toLowerCase().includes(filter.search.toLowerCase()), false))) ||
									(activity.title != null && activity.title.toLowerCase().includes(filter.search.toLowerCase())));
				});
			}
		).subscribe(activities => this.activities = activities);

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
			this.store.dispatch(this.activityActions.deleteActivity(this.selectedActivity.$key));
			this.selectedActivity = null;
		} else {
			console.error('activity does not belong to you.');
		}
	}
}
