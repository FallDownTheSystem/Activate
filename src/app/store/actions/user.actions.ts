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
}
