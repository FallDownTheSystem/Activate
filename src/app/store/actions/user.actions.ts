import { Favorite } from '../../model/favorite';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { User } from '../../model/user';

@Injectable()
export class UserActions {

	static LOGOFF = 'LOGOFF';
	logoff(): Action {
		return {
			type: UserActions.LOGOFF,
			payload: null
		};
	}

	static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
	loginSuccess(user: User): Action {
		return {
			type: UserActions.LOGIN_SUCCESS,
			payload: user
		};
	}

	static USER_UPDATED = 'USER_UPDATED';
	userUpdated(user: User): Action {
		return {
			type: UserActions.USER_UPDATED,
			payload: user
		};
	}

	static ADD_USER_WITH_ROLES = 'ADD_USER_WITH_ROLES';
	addUserWithRoles(user: User): Action {
		return {
			type: UserActions.ADD_USER_WITH_ROLES,
			payload: user
		};
	}

	static LOAD_FAVORITES = 'LOAD_FAVORITES';
	loadFavorites(): Action {
		return {
			type: UserActions.LOAD_FAVORITES
		};
	}

	static LOAD_FAVORITES_SUCCESS = 'LOAD_FAVORITES_SUCCESS';
	loadFavoritesSuccess(favorites: Favorite[]): Action {
		return {
			type: UserActions.LOAD_FAVORITES_SUCCESS,
			payload: favorites
		};
	}

	static ADD_FAVORITE = 'ADD_FAVORITE';
	addFavorite(activityID: string): Action {
		return {
			type: UserActions.ADD_FAVORITE,
			payload: activityID
		};
	}

	static ADD_FAVORITE_SUCCESS = 'ADD_FAVORITE_SUCCESS';
	addFavoriteSuccess(): Action {
		return {
			type: UserActions.ADD_FAVORITE_SUCCESS
		};
	}

	static DELETE_FAVORITE = 'DELETE_FAVORITE';
	deleteFavorite(activityID: string): Action {
		return {
			type: UserActions.DELETE_FAVORITE,
			payload: activityID
		};
	}

	static DELETE_FAVORITE_SUCCESS = 'DELETE_FAVORITE_SUCCESS';
	deleteFavoriteSuccess(): Action {
		return {
			type: UserActions.DELETE_FAVORITE_SUCCESS
		};
	}


}
