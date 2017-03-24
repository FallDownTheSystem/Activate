import { Coords } from '../../model/activity';
import { GeolocationService } from '../../services/geolocation.service';
import { Filter } from '../../model/filter';
import { FilterService } from '../../services/filter.service';
import { ActivityActions } from '../../store/actions/activity.actions';
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
	geoSub: any;
	activityForm: FormGroup;
	filterForm: FormGroup;
	icon = '';
	defaultValues = {
		search: '',
		category: null,
		distance: '50'
	};
	filter: Filter = new Filter;
	geoloc: Coords = null;

	constructor(private fb: FormBuilder,
							private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private filterService: FilterService,
							private geolocService: GeolocationService) {
		this.categoriesObs = store.select(s => s.categories);
		this.geoSub = geolocService.getLocation({enableHighAccuracy: false, timeout: 5000,	maximumAge: 60000}).subscribe(geoloc => {
			this.geoloc = new Coords(geoloc.coords.latitude, geoloc.coords.longitude, geoloc.coords.accuracy);
		});

		this.filter = {
			search: '',
			distance: 50,
			category: null,
			geoloc: null
		};
	}

	ngOnInit() {
		this.categorySub = this.categoriesObs.subscribe(category => this.categories = category);
		this.filterForm = this.fb.group(this.defaultValues);
	}

	onFilterSubmit() {
		// Push values through filter service
		this.filter = {
			search: this.filterForm.get('search').value,
			distance: parseFloat(this.filterForm.get('distance').value),
			category: this.filterForm.get('category').value,
			geoloc: this.geoloc
		};
		this.filterService.filter.next(this.filter);
		this.store.dispatch(this.activityActions.loadActivities()); // FIXME: changes pushed based on subscription, instead of request?
		this.onFilterChange.emit();
	}

	ngOnDestroy() {
		if (this.categorySub) {
			this.categorySub.unsubscribe();
		}
	}
}
