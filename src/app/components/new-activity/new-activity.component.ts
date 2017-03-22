import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import '../../rxjs-extensions';

import { Category } from '../../model/category';
import { Activity, Coords } from '../../model/activity';
import { ActivityActions } from '../../store/actions/activity.actions';
import { AppStore } from '../../store/app-store';
import { User } from '../../model/user';

import { GeolocationService } from '../../services/geolocation.service';

@Component({
	selector: 'act-new-activity',
	templateUrl: './new-activity.component.html',
	styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit, OnDestroy {

	activity: Activity;
	actKey: string;
	categoriesObs: Observable<Category[]>;
	activityObs: Observable<Activity>;
	categories: Category[];
	geoloc: Coords = null;
	editMode: boolean = false;
	subscription: any;
	subscription2: any;
	subscription3: any;
	subscription4: any;
	activityForm: FormGroup;
	enteredTags: string[] = [];
	user: User;
	activityKey: string;

	constructor(private location: Location,
							private fb: FormBuilder,
							private router: Router,
							private route: ActivatedRoute,
							private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private geoService: GeolocationService) {
		this.subscription4 = geoService.getLocation({enableHighAccuracy: false, timeout: 5000,	maximumAge: 60000}).subscribe(geoloc => {
			this.geoloc = new Coords(geoloc.coords.latitude, geoloc.coords.longitude, geoloc.coords.accuracy);
		});

		this.activityObs = store.select(s => s.activity);
		this.categoriesObs = store.select(s => s.categories);

		this.subscription2 = store.select(s => s.user).subscribe(user => {
			this.user = user;
			if (!user) {
				this.router.navigate(['/home']);
			}
		});
	}

	ngOnInit() {
		if (this.router.url.includes('edit-activity')) { this.editMode = true; }
		this.subscription = this.categoriesObs.subscribe(category => this.categories = category);
		if (this.editMode) {
					this.route.params.subscribe(params => {
					this.activityKey = params['actKey'];
					this.store.dispatch(this.activityActions.getActivity(this.activityKey));
					this.subscription4 = this.activityObs.subscribe(activity => {
						this.activity = activity[0];
						this.actKey = activity[0].$key;
					});
				});
		} else {
			this.activity = new Activity();
		}
		this.createForm(this.activity);
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.subscription2) {
			this.subscription2.unsubscribe();
		}
		if (this.subscription3) {
			this.subscription3.unsubscribe();
		}
		if (this.subscription4) {
			this.subscription4.unsubscribe();
		}
	}

	addTag() {
		let tag = this.activityForm.get('tags').value;
		if (tag) {
			if (this.enteredTags.indexOf(tag) < 0) {
				this.enteredTags.push(tag);
			}
			this.activityForm.get('tags').setValue('');
		}
	}

	removeEnteredTag(tag) {
		this.enteredTags = this.enteredTags.filter(t => t !== tag);
	}

	onSubmit() {
		// Validations
		if (this.activityForm.invalid) {
			return;
		}
		// Get activity object from the forms
		let activity: Activity = this.getActivityFromFormValue(this.activityForm.value);
		if (!this.editMode) {
			activity.geoloc = this.geoloc;
			activity.created_uid = this.user.userId;
			activity.createdOn = new Date();
		}


		// Call saveActivity
		if (this.editMode) {
			this.updateActivity(activity);
		} else {
			this.saveActivity(activity);
		}
	}

	getActivityFromFormValue(formValue: any): Activity {
		let activity: Activity;
		activity = new Activity();

		activity.title = formValue.title;
		activity.subtitle = formValue.subtitle;
		activity.category = formValue.category; // Fix getting category object WITH icon string as well?
		activity.description = formValue.description;
		activity.location = formValue.location;
		activity.date = formValue.date;
		activity.time = formValue.time;
		activity.organizer = formValue.organizer;
		activity.contact = formValue.contact;
		activity.tags = [...this.enteredTags];
		return activity;
	}

	onSelect() {
		// console.log("asd");
	}

	updateActivity(activity: Activity) {
		this.store.dispatch(this.activityActions.updateActivity(this.actKey, activity));
	}

	saveActivity(activity: Activity) {
		this.store.dispatch(this.activityActions.addActivity(activity));
	}

	createForm(activity: Activity) {
		this.activityForm = this.fb.group({
			title: [activity.title, Validators.required],
			subtitle: activity.subtitle,
			category: [activity.category, Validators.required],
			location: [activity.location, Validators.required],
			description: [activity.description, Validators.compose([Validators.required, Validators.maxLength(1000)])],
			time: activity.time,
			date: [activity.date, Validators.required],
			organizer: [activity.organizer, Validators.required],
			contact: activity.contact,
			tags: ''
		});
		if (this.editMode) {
			if (activity.tags !== undefined && activity.tags !== null) {
				activity.tags.map(tag => this.enteredTags.push(tag));
			}
			this.activityForm.get('category').setValue(this.categories.filter(cat => cat.category === this.activity.category.category).pop());
		}
	}

	goBack(): void {
		this.location.back();
	}
}
