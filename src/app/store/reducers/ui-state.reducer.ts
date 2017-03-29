import { Filter } from '../../model/filter';
import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import {Action} from '@ngrx/store';

import { UIStateActions } from '../actions/ui-state.action';

const defaultFilter = {
		search: '',
		category: null,
		distance: '50',
		favorite: false,
		own: false,
		order: ''
	};

export const loginRedirectUrl = (state: any = null, action: Action): string => {
	switch (action.type) {
		case UIStateActions.LOGIN_REDIRECT_URL:
			return action.payload;
		default:
			return state;
	}
};

export const activityFilter = (state: any = defaultFilter, action: Action): Filter => {
	switch (action.type) {
		case UIStateActions.ACTIVITY_FILTER:
			return action.payload;
		default:
			return state;
	}
}
