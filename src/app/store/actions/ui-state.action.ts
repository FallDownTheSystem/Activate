import { Filter } from '../../model/filter';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

@Injectable()
export class UIStateActions {

	static LOGIN_REDIRECT_URL = 'LOGIN_REDIRECT_URL';
	setLoginRedirectUrl(url?: string): Action {
		return {
			type: UIStateActions.LOGIN_REDIRECT_URL,
			payload: url
		};
	}

	static ACTIVITY_FILTER = 'ACTIVITY_FILTER';
	setActivityFilter(filter: Filter): Action {
		return {
			type: UIStateActions.ACTIVITY_FILTER,
			payload: filter
		};
	}
}
