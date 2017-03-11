import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CategoryService, Category } from '../services/category.service';
import { ActivityService, Activity } from '../services/activity.service';
import { Router } from '@angular/router';
import '../rxjs-extensions';

@Component({
	selector: 'act-new-activity',
	templateUrl: './new-activity.component.html',
	styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit, OnDestroy {

	activity: Activity;
	categories: Category[];
	subcription: any;
	activityForm: FormGroup;
	enteredTags: string[] = [];

	constructor(private fb: FormBuilder,
							private router: Router,
							private categoryService: CategoryService,
							private activityService: ActivityService) {
	}

	ngOnInit() {
		this.subcription = this.categoryService.getCategories().subscribe(category => this.categories = category);
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
		activity.organizer = formValue.organizer;
		activity.contact = formValue.contact;
		activity.tags = this.enteredTags;
		return activity;
	}

	saveActivity(activity: Activity) {
		this.activityService.saveActivity(activity).subscribe(response => {
			this.router.navigate(['/home']);
		});
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
