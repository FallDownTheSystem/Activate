import { Favorite } from '../../model/favorite';
import { UserService } from '../../services/user.service';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { UserActions } from '../actions/user.actions';
import { User } from '../../model/user';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable()
export class UserEffects {
	constructor (
			private actions$: Actions,
			private userActions: UserActions,
			private svc: AuthenticationService,
			private userSvc: UserService,
	) {}

	@Effect()
	loadUserRoles$ = this.actions$
			.ofType(UserActions.LOGIN_SUCCESS)
			.map((action) => action.payload)
			.switchMap((user: User) => this.svc.getUserRoles(user))
			.map((user: User) => this.userActions.addUserWithRoles(user));

	@Effect()
	loadFavorites$ = this.actions$
			.ofType(UserActions.LOAD_FAVORITES)
			.switchMap(() => this.userSvc.getFavorites())
			.map((favorites: Favorite[]) => this.userActions.loadFavoritesSuccess(favorites));

	@Effect()
	deleteFavorite$ = this.actions$
			.ofType(UserActions.DELETE_FAVORITE)
			.do((action) => this.userSvc.deleteFavorite(action.payload))
			.filter(() => false);

	@Effect()
	addFavorite$ = this.actions$
			.ofType(UserActions.ADD_FAVORITE)
			.do((action) => this.userSvc.saveFavorite(action.payload))
			.filter(() => false);
}
