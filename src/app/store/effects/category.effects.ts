import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import { AppStore } from '../app-store';
import { CategoryActions } from '../actions/category.actions';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';

@Injectable()
export class CategoryEffects {
	constructor (
			private actions$: Actions,
			private categoryActions: CategoryActions,
			private svc: CategoryService
	) {}

	// tslint:disable-next-line:member-ordering
	@Effect()
	loadCategories$ = this.actions$
	.ofType(CategoryActions.LOAD_CATEGORIES)
	.switchMap(() => this.svc.getCategories())
	.map((categories: Category[]) => this.categoryActions.loadCategoriesSuccess(categories));
}
