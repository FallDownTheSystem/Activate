import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Action } from '@ngrx/store';

import { ActivityActions } from '../actions/activity.actions';
import { Activity } from '../../services/activity.service';

export const activities = (state: any = [], action: Action): Activity[] => {
	switch (action.type) {
		case ActivityActions.LOAD_ACTIVITIES_SUCCESS:
			return action.payload;
		case ActivityActions.ADD_ACTIVITY_SUCCESS:
			return [...state, ...action.payload];
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
