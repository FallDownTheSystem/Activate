import { Category } from '../services/category.service';

import { categories } from './reducers/categories.reducer';

import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

export interface AppStore {
	categories: Category[];
}

export default compose(combineReducers)({
	categories: categories
});
