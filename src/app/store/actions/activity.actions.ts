import { User } from '../../model/user';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Activity } from '../../model/activity';

@Injectable()
export class ActivityActions {

	static LOAD_ACTIVITIES = 'LOAD_ACTIVITIES';
	loadActivities(): Action {
		return {
			type: ActivityActions.LOAD_ACTIVITIES
		};
	}

	static LOAD_ACTIVITIES_SUCCESS = 'LOAD_ACTIVITIES_SUCCESS';
	loadActivitiesSuccess(activities: Activity[]): Action {
		return {
			type: ActivityActions.LOAD_ACTIVITIES_SUCCESS,
			payload: activities
		};
	}

		static LOAD_USER_ACTIVITIES = 'LOAD_USER_ACTIVITIES';
	loadUserActivities(user: User): Action {
		return {
			type: ActivityActions.LOAD_USER_ACTIVITIES,
			payload: user
		};
	}

	static LOAD_USER_ACTIVITIES_SUCCESS = 'LOAD_USER_ACTIVITIES_SUCCESS';
	loadUserActivitiesSuccess(activities: Activity[]): Action {
		return {
			type: ActivityActions.LOAD_USER_ACTIVITIES_SUCCESS,
			payload: activities
		};
	}


	static ADD_ACTIVITY = 'ADD_ACTIVITY';
	addActivity(activity: Activity): Action {
		return {
			type: ActivityActions.ADD_ACTIVITY,
			payload: activity
		};
	}

	static ADD_ACTIVITY_SUCCESS = 'ADD_ACTIVITY_SUCCESS';
	addActivitySuccess(): Action {
		return {
			type: ActivityActions.ADD_ACTIVITY_SUCCESS,
			payload: null
		};
	}

}