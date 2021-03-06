import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Action } from '@ngrx/store';

import { CategoryActions } from '../actions/category.actions';
import { Category } from '../../model/category';

export const categories = (state: any = [], action: Action): Category[] => {
	switch (action.type) {
		case CategoryActions.LOAD_CATEGORIES_SUCCESS:
			return action.payload;
		default:
			return state;
	}
};
