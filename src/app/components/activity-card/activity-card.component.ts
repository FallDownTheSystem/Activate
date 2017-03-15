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
				animate(150, keyframes([
					style({opacity: 0, transform: 'translateY(-20%)', marginBottom: '-20%', offset: 0}),
					style({opacity: 1, transform: 'translateY(0)', marginBottom: '0', offset: 1}),
				]))
			]),
			transition('* => void', [
				animate(150, keyframes([
					style({opacity: 1, transform: 'translateY(0)', marginBottom: '0', offset: 0}),
					style({opacity: 0, transform: 'translateY(-20%)', marginBottom: '-20%', offset: 1}),
				]))
			])
		]),
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
	subcription: any;
	selectedActivity: Activity;
	mobileView: boolean;
	view: string;

	constructor(private store: Store<AppStore>) {
		this.activitiesObs = store.select(s => s.activities);
	}

	ngOnInit() {
		this.subcription = this.activitiesObs.subscribe(activities => this.activities = activities);
		this.onResize();
	}

	ngOnDestroy() {
		if (this.subcription) {
			this.subcription.unsubscribe();
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
}
