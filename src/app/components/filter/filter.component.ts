import { UIStateActions } from '../../store/actions/ui-state.action';
import { Coords } from '../../model/activity';
import { GeolocationService } from '../../services/geolocation.service';
import { Filter } from '../../model/filter';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Category } from '../../model/category';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import '../../rxjs-extensions';
import { AppStore } from '../../store/app-store';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { GmapComponent } from 'app/components/gmap/gmap.component';

@Component({
	selector: 'act-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy {
	dialogRef: MdDialogRef<any>;
	@Output() onFilterChange = new EventEmitter();
	dialogResult: any;
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
							private geolocService: GeolocationService,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef) {
		this.categoriesObs = store.select(s => s.categories);
		this.filtersObs = store.select(s => s.activityFilter);

		const geoObs = {
			next: x => this.geoloc = new Coords(x.coords.latitude, x.coords.longitude, x.coords.accuracy),
			error: err => err,
			complete: () => this.onFilterSubmit(),
		};

		this.geoSub = geolocService.getCurrentPosition().subscribe(subject => subject(geoObs));

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

	openDialog() {
		const config = new MdDialogConfig();
		config.viewContainerRef = this.viewContainerRef;
		this.dialogRef = this.dialog.open(GmapComponent, config);
		if (this.dialogResult) {
			this.dialogRef.componentInstance.param = this.dialogResult;
		} else {
			this.dialogRef.componentInstance.param = this.geoloc;
		}
		this.dialogRef.afterClosed().subscribe(result => {
							// console.log('result', result);
			if (result !== 'cancel') {
				this.dialogResult = result;
			}
			this.dialogRef = null;
		});
	}

	onFilterSubmit() {
		this.filter = {
			search: this.filterForm.get('search').value,
			distance: parseFloat(this.filterForm.get('distance').value),
			category: this.filterForm.get('category').value,
			geoloc: this.dialogResult ? this.dialogResult : this.geoloc ? this.geoloc : null,
			favorite: this.filterForm.get('favorite').value,
			own: this.filterForm.get('own').value,
			order: this.filterForm.get('order').value,
		};

		this.store.dispatch(this.UIStateActions.setActivityFilter(this.filter));
		this.onFilterChange.emit();
	}

	ngOnDestroy() {

	}
}

