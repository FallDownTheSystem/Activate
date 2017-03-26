import { UIStateActions } from '../../store/actions/ui-state.action';
import { Coords } from '../../model/activity';
import { GeolocationService } from '../../services/geolocation.service';
import { Filter } from '../../model/filter';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
export class FilterComponent implements OnDestroy {

	@Output() onFilterChange = new EventEmitter();

	categoriesObs: Observable<Category[]>;
	categories: Category[];
	categorySub: any;
	activitySub: any;
	geoSub: any;
	activityForm: FormGroup;
	filterForm: FormGroup;
	icon = '';
	defaultValues = {
		search: '',
		category: null,
		distance: '50',
		favorite: false,
		own: false,
		order: ''
	};
	filtersObs: Observable<Filter>;
	filter: Filter = new Filter;
	geoloc: Coords = null;

	constructor(private fb: FormBuilder,
							private store: Store<AppStore>,
							private UIStateActions: UIStateActions,
							private geolocService: GeolocationService) {
		this.categoriesObs = store.select(s => s.categories);
		this.filtersObs = store.select(s => s.activityFilter);
		this.geoSub = geolocService.getCurrentPosition().subscribe(geoloc => {
			this.geoloc = new Coords(geoloc.coords.latitude, geoloc.coords.longitude, geoloc.coords.accuracy);
			this.onFilterSubmit();
		});

		this.filter = {
			search: '',
			distance: 50,
			category: null,
			geoloc: null,
			favorite: false,
			own: false,
			order: ''
		};
	}

	ngOnInit() {
		this.activitySub = this.filtersObs.subscribe(filter => this.filter = filter);
		this.filterForm = this.fb.group(this.defaultValues);
		this.filterForm.reset(this.defaultValues);
	}

	onFilterSubmit() {
		this.geoSub = this.geolocService.getCurrentPosition().subscribe(geoloc => {
			this.geoloc = new Coords(geoloc.coords.latitude, geoloc.coords.longitude, geoloc.coords.accuracy);
			console.log(this.geoloc);
		});

		this.filter = {
			search: this.filterForm.get('search').value,
			distance: parseFloat(this.filterForm.get('distance').value),
			category: this.filterForm.get('category').value,
			geoloc: this.geoloc,
			favorite: this.filterForm.get('favorite').value,
			own: this.filterForm.get('own').value,
			order: this.filterForm.get('order').value,
		};

		this.store.dispatch(this.UIStateActions.setActivityFilter(this.filter));
		this.onFilterChange.emit();
	}

	ngOnDestroy() {
		if (this.geoSub) {
			this.geoSub.unsubscribe();
		}
	}
}
