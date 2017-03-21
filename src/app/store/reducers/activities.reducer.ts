import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Action } from '@ngrx/store';

import { ActivityActions } from '../actions/activity.actions';
import { Activity } from '../../model/activity';

export const activities = (state: any = [], action: Action): Activity[] => {
	switch (action.type) {
		case ActivityActions.LOAD_ACTIVITIES_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};

export const activity = (state: any = [], action: Action): Activity => {
	switch (action.type) {
		case ActivityActions.GET_ACTIVITY_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};

export const userActivities = (state: any = [], action: Action): Activity[] => {
	switch (action.type) {
		case ActivityActions.LOAD_USER_ACTIVITIES_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};

export const activitySaveStatus = (state: any = 'NONE', action: Action): string => {
	switch (action.type) {
		case ActivityActions.ADD_ACTIVITY:
			return 'IN PROGRESS';
		case ActivityActions.ADD_ACTIVITY_SUCCESS:
			return 'SUCCESS';
		default:
			return state;
	}
};

export const activityUpdateStatus = (state: any = 'NONE', action: Action): string => {
	switch (action.type) {
		case ActivityActions.UPDATE_ACTIVITY:
			return 'IN PROGRESS';
		case ActivityActions.UPDATE_ACTIVITY_SUCCESS:
			return 'SUCCESS';
		default:
			return state;
	}
};
