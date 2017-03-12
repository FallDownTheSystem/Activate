import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Activity } from '../services/activity.service';
import { AppStore } from '../store/app-store';

@Component({
	selector: 'act-activity-card',
	templateUrl: './activity-card.component.html',
	styleUrls: ['./activity-card.component.scss'],
	host: {
		'(window:resize)': 'onResize($event)'
	}
})
export class ActivityCardComponent implements OnInit, OnDestroy {
	activitiesObs: Observable<Activity[]>;
	activities: Activity[];
	subcription: any;

	// *ngFor adds booleans representing expanded state
	expanded = [];
	columns;
	containerWidth;

	constructor(private store: Store<AppStore>) {
		this.activitiesObs = store.select(s => s.activities);
	}

	ngOnInit() {
		this.subcription = this.activitiesObs.subscribe(activities => this.activities = activities);
		this.getColCount();
	}

	ngOnDestroy() {
		if (this.subcription) {
			this.subcription.unsubscribe();
		}
	}

	getColCount() {
		console.log("asd");
		var cols = Math.floor(window.innerWidth/300) - 1 ;
		this.columns = cols > 1 ? cols : 1;
		this.containerWidth = this.columns*355 + 'px';
	}

	onResize(event) {
		this.getColCount();
	}

}
