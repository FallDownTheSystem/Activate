import { Category } from '../model/category';
import { Activity } from '../model/activity';
import { User } from '../model/user';

import { categories } from './reducers/categories.reducer';
import { activities, activitySaveStatus } from './reducers/activities.reducer';
import { user } from './reducers/user.reducer';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
	user: User;
	categories: Category[];
	activities: Activity[];
	activitySaveStatus: string;
}

export default compose(combineReducers)({
	user: user,
	categories: categories,
	activities: activities,
	activitySaveStatus: activitySaveStatus
});
