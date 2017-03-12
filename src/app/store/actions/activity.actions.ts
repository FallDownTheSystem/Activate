import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

import { Activity } from '../../services/activity.service';

@Injectable()
export class ActivityActions {

	static LOAD_ACTIVITIES = 'LOAD_ACTIVITIES';
	loadActivities(): Action {
		return {
			type: ActivityActions.LOAD_ACTIVITIES
		};
	}

	// tslint:disable-next-line:member-ordering
	static LOAD_ACTIVITIES_SUCCESS = 'LOAD_ACTIVITIES_SUCCESS';
	loadActivitiesSuccess(activities: Activity[]): Action {
		return {
			type: ActivityActions.LOAD_ACTIVITIES_SUCCESS,
			payload: activities
		};
	}

	// tslint:disable-next-line:member-ordering
	static ADD_ACTIVITY = 'ADD_ACTIVITY';
	addActivity(activity: Activity): Action {
		return {
			type: ActivityActions.ADD_ACTIVITY,
			payload: activity
		};
	}
	static ADD_ACTIVITY_SUCCESS = 'ADD_ACTIVITY_SUCCESS';
	addActivitySuccess(activity: Activity): Action {
		return {
			type: ActivityActions.ADD_ACTIVITY_SUCCESS,
			payload: activity
		};
	}

}