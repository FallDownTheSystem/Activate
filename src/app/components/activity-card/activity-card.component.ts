import { ActivityActions } from '../../store/actions/activity.actions';
import { User } from '../../model/user';
import { Component, OnInit, OnDestroy, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Activity } from '../../model/activity';
import { AppStore } from '../../store/app-store';

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
	],
	host: {
		'(window:resize)': 'onResize()'
	}
})
export class ActivityCardComponent implements OnInit, OnDestroy {
	activitiesObs: Observable<Activity[]>;
	activities: Activity[];
	subscription: any;
	selectedActivity: Activity;
	mobileView: boolean;
	view: string;
	user: User;
	subscription2: any;
	actKey: string;

	constructor(private store: Store<AppStore>, private activityActions: ActivityActions) {
		this.activitiesObs = store.select(s => s.activities);
		this.subscription2 = store.select(s => s.user).subscribe(user => {
			this.user = user;
		});
	}

	ngOnInit() {
		this.subscription = this.activitiesObs.subscribe(activities => this.activities = activities);
		this.onResize();
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (this.subscription2) {
			this.subscription2.unsubscribe();
		}
	}

	select(i) {
		if (this.selectedActivity === this.activities[i]) {
			this.selectedActivity = null;
		} else {
			this.selectedActivity = this.activities[i];
		}
	}

	onResize() {
		this.mobileView = window.innerWidth <= 850;
		this.view = this.mobileView ? 'mobile' : 'desktop';
	}

	deleteActivity(actKey: string) {
		if (this.selectedActivity.created_uid === this.user.userId) {
			this.store.dispatch(this.activityActions.deleteActivity(this.selectedActivity.$key));
			this.selectedActivity = null;
		} else {
			console.error('activity does not belong to you.');
		}
	}
}
