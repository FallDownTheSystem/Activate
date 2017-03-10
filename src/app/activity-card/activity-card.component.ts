import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivityService, Activity } from '../services/activity.service';

@Component({
	selector: 'act-activity-card',
	templateUrl: './activity-card.component.html',
	styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent implements OnInit, OnDestroy {
	activities: Activity[];
	subcription: any;

	// *ngFor adds booleans representing expanded state
	expanded = [];

	constructor(private activityService: ActivityService) { }

	ngOnInit() {
		this.subcription = this.activityService.getActivities().subscribe(activities => this.activities = activities);
	}

	ngOnDestroy() {
		if (this.subcription) {
			this.subcription.unsubscribe();
		}
	}

	expand(i) {
		// This function might fire a bit too much, dunno why lol, check by uncommenting console.log
		// 
		return this.expanded[i] ? 3:2;
	}

	getWindowWidth() {
		return Math.floor(window.innerWidth/305);
	}

}
