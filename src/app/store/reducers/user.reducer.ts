import { Favorite } from '../../model/favorite';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Action } from '@ngrx/store';

import { UserActions } from '../actions/user.actions';
import { User } from '../../model/user';

export const user = (state: any = null, action: Action): User => {
	switch (action.type) {
		case UserActions.ADD_USER_WITH_ROLES:
			return action.payload;
		case UserActions.USER_UPDATED:
			return action.payload;
		case UserActions.LOGOFF:
			return null;
		default:
			return state;
	}
};

export const favorites = (state: any = [], action: Action): Favorite[] => {
	switch (action.type) {
		case UserActions.LOAD_FAVORITES_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};

export const favoriteStatus = (state: any = 'NONE', action: Action): string => {
	switch (action.type) {
		case UserActions.ADD_FAVORITE:
			return 'IN PROGRESS';
		case UserActions.ADD_FAVORITE_SUCCESS:
			return 'Favorite successfully added';
		case UserActions.DELETE_FAVORITE:
			return 'IN PROGRESS';
		case UserActions.DELETE_FAVORITE_SUCCESS:
			return 'Favorite successfully deleted';
		default:
			return state;
	}
};
