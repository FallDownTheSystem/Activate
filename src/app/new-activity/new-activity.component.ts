import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import '../rxjs-extensions';

import { Category } from '../services/category.service';
import { Activity } from '../services/activity.service';
import { ActivityActions } from '../store/actions/activity.actions';
import { AppStore } from '../store/app-store';


@Component({
	selector: 'act-new-activity',
	templateUrl: './new-activity.component.html',
	styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit, OnDestroy {

	activity: Activity;
	categoriesObs: Observable<Category[]>;
	categories: Category[];
	subcription: any;
	activityForm: FormGroup;
	enteredTags: string[] = [];

	constructor(private fb: FormBuilder,
							private router: Router,
							private store: Store<AppStore>,
							private activityActions: ActivityActions) {
		this.categoriesObs = store.select(s => s.categories);
	}

	ngOnInit() {
		this.subcription = this.categoriesObs.subscribe(category => this.categories = category);
		this.activity = new Activity();
		this.createForm(this.activity);
	}

	ngOnDestroy() {
		if (this.subcription) {
			this.subcription.unsubscribe();
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
		// get activty object from the forms
		let activity: Activity = this.getActivityFromFormValue(this.activityForm.value);
		// call saveActivity
		this.saveActivity(activity);
	}

	getActivityFromFormValue(formValue: any): Activity {
		let activity: Activity;
		activity = new Activity();


		activity.id = 0;
		activity.username = '';
		activity.title = formValue.title;
		activity.subtitle = formValue.subtitle;
		activity.category = formValue.category;
		activity.description = formValue.description;
		activity.location = formValue.location;
		activity.gpsloc = '';
		activity.date = formValue.date;
		activity.time = formValue.time;
		activity.createdOn = '';
		activity.organizer = formValue.organizer;
		activity.contact = formValue.contact;
		activity.tags = this.enteredTags;
		return activity;
	}

	saveActivity(activity: Activity) {
		this.store.dispatch(this.activityActions.addActivity(activity));
	}

	createForm(activity: Activity) {
		this.activityForm = this.fb.group({
			title: [activity.title, Validators.required],
			subtitle: [activity.subtitle, Validators.required],
			category: [activity.category, Validators.required],
			location: [activity.location, Validators.required],
			description: [activity.description, Validators.required],
			time: activity.time,
			date: [activity.date, Validators.required],
			organizer: [activity.organizer, Validators.required],
			contact: [activity.contact, Validators.required],
			tags: ''
		});
	}
}
