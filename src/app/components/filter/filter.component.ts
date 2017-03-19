import { FilterService } from '../../services/filter.service';
import { ActivityActions } from '../../store/actions/activity.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Category } from '../../model/category';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import '../../rxjs-extensions';
import { AppStore } from '../../store/app-store';

@Component({
	selector: 'act-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

	categoriesObs: Observable<Category[]>;
	categories: Category[];
	subscription: any;
	activityForm: FormGroup;
	filterForm: FormGroup;
	icon: string = '';
	defaultValues = {
		search: '',
		category: '',
		distance: '50'
	};

	constructor(private fb: FormBuilder,
							private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private filterService: FilterService) {
		this.categoriesObs = store.select(s => s.categories);
	}

	ngOnInit() {
		this.subscription = this.categoriesObs.subscribe(category => this.categories = category);
		this.filterForm = this.fb.group(this.defaultValues);
	}

	onFilterSubmit() {
		this.filterService.search.next(this.filterForm.get('search').value);
		this.filterService.distance.next(parseFloat(this.filterForm.get('distance').value));
		this.filterService.category.next(this.filterForm.get('category').value);
		this.store.dispatch(this.activityActions.loadActivities());
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	changeIcon() {
		this.icon = (this.filterForm.controls["category"].value === "" ? '' : this.categories.filter(category => category.category === this.filterForm.controls["category"].value)[0].icon );
	}

	distanceChanged(event) {
		let value: number;
		value = (event.value !== undefined ? event.value : event.target.value);
		this.filterForm.controls["distance"].setValue(value);
	}

}
