import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Activity } from '../model/activity';
import { AppStore } from '../store/app-store';

@Component({
	selector: 'act-activity-card',
	templateUrl: './activity-card.component.html',
	styleUrls: ['./activity-card.component.scss'],
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
		if (this.selectedActivity == this.activities[i]) {
			this.selectedActivity = null;
		} else {
			this.selectedActivity = this.activities[i];
		}
	}

	onResize() {
		this.mobileView = false;
		if (window.innerWidth < 850) this.mobileView = true;
	}

}
