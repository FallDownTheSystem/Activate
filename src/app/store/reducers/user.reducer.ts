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
