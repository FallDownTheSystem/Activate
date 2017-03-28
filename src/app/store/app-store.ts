import { Favorite } from '../model/favorite';
import { Message } from '../model/message';
import { Filter } from '../model/filter';
import { Category } from '../model/category';
import { Activity } from '../model/activity';
import { User } from '../model/user';

import { categories } from './reducers/categories.reducer';
import { activities, activityStatus } from './reducers/activities.reducer';
import { messages, messageStatus } from './reducers/message.reducer';
import { user, favorites, favoriteStatus } from './reducers/user.reducer';
import { loginRedirectUrl, activityFilter } from './reducers/ui-state.reducer';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
	user: User;
	categories: Category[];
	activities: Activity[];
	activityStatus: string;
	messages: Message[];
	messageStatus: string;
	activityFilter: Filter;
	favorites: Favorite[];
	favoriteStatus: string;
	loginRedirectUrl: string;
}

export default compose(combineReducers)({
	user: user,
	categories: categories,
	activities: activities,
	activityStatus: activityStatus,
	messages: messages,
	messageStatus: messageStatus,
	activityFilter: activityFilter,
	favorites: favorites,
	favoriteStatus: favoriteStatus,
	loginRedirectUrl: loginRedirectUrl
});
