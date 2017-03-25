import { Filter } from '../../model/filter';
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

	static DELETE_ACTIVITY = 'DELETE_ACTIVITY';
	deleteActivity(key: String): Action {
		return {
			type: ActivityActions.DELETE_ACTIVITY,
			payload: key
		};
	}

	static DELETE_ACTIVITY_SUCCESS = 'DELETE_ACTIVITY_SUCCESS';
	deleteActivitySuccess(): Action {
		return {
			type: ActivityActions.DELETE_ACTIVITY_SUCCESS,
			payload: null
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

	static UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
	updateActivity(actKey: string, activity: Activity): Action {
		return {
			type: ActivityActions.UPDATE_ACTIVITY,
			payload: [actKey, activity]
		};
	}

	static UPDATE_ACTIVITY_SUCCESS = 'UPDATE_ACTIVITY_SUCCESS';
	updateActivitySuccess(): Action {
		return {
			type: ActivityActions.UPDATE_ACTIVITY_SUCCESS,
			payload: null
		};
	}
}
