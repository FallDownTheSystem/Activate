import { Category } from '../services/category.service';
import { Activity } from '../services/activity.service';

import { categories } from './reducers/categories.reducer';
import { activities, activitySaveStatus } from './reducers/activities.reducer';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
	categories: Category[];
	activities: Activity[];
	activitySaveStatus: string;
}

export default compose(combineReducers)({
	categories: categories,
	activities: activities,
	activitySaveStatus: activitySaveStatus
});
