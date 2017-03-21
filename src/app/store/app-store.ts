import { Category } from '../model/category';
import { Activity } from '../model/activity';
import { User } from '../model/user';

import { categories } from './reducers/categories.reducer';
import { activity, activities, userActivities, activitySaveStatus, activityUpdateStatus, activityDeleteStatus } from './reducers/activities.reducer';
import { user } from './reducers/user.reducer';
import { loginRedirectUrl } from './reducers/ui-state.reducer';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
	user: User;
	categories: Category[];
	activities: Activity[];
	activity: Activity;
	userActivities: Activity[];
	activitySaveStatus: string;
	activityUpdateStatus: string;
	activityDeleteStatus: string;
	loginRedirectUrl: string;
}

export default compose(combineReducers)({
	user: user,
	categories: categories,
	activities: activities,
	activity: activity,
	userActivities: userActivities,
	activitySaveStatus: activitySaveStatus,
	activityUpdateStatus: activityUpdateStatus,
	activityDeleteStatus: activityDeleteStatus,
	loginRedirectUrl: loginRedirectUrl
});
