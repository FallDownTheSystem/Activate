import { validateOldDate } from '../../directives/old-activity.directive';
import { Message } from '../../model/message';
import { Component, OnInit, Inject, OnDestroy, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import '../../rxjs-extensions';
import * as firebase from 'firebase';
import { Category } from '../../model/category';
import { Activity, Coords } from '../../model/activity';
import { ActivityActions } from '../../store/actions/activity.actions';
import { AppStore } from '../../store/app-store';
import { User } from '../../model/user';
import { GeolocationService } from '../../services/geolocation.service';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { GmapComponent } from 'app/components/gmap/gmap.component';

@Component({
	selector: 'act-new-activity',
	templateUrl: './new-activity.component.html',
	styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnDestroy {
	dialogRef: MdDialogRef<any>;
	dialogResult: any;
	activity: Activity;
	activities: Activity[];
	activityKey: string;
	categoriesObs: Observable<Category[]>;
	activitiesObs: Observable<Activity[]>;
	categories: Category[];
	geoloc: Coords = null;
	editMode = false;
	categorySub: any;
	userSub: any;
	activitySub: any;
	geoSub: any;
	activityForm: FormGroup;
	enteredTags: string[] = [];
	user: User;

	constructor(private location: Location,
							private fb: FormBuilder,
							private router: Router,
							private route: ActivatedRoute,
							private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private geolocService: GeolocationService,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef) {
		this.activitiesObs = store.select(s => s.activities);
		this.categoriesObs = store.select(s => s.categories);

		const geoObserver = {
			next: x => this.geoloc = new Coords(x.coords.latitude, x.coords.longitude, x.coords.accuracy),
			error: err => console.error('Geolocation observer error: ' + err),
			complete: () => console.log('Geolocation observer completed'),
		};

		this.geoSub = geolocService.getCurrentPosition().subscribe(subject => subject(geoObserver));

		// Guards against unauthorized users
		this.userSub = store.select(s => s.user).subscribe(user => {
			this.user = user;
			if (!user) {
				this.router.navigate(['/home']);
			}
		});
	}

	ngOnInit() {

		this.categorySub = this.categoriesObs.subscribe(categories => this.categories = categories);
		if (this.router.url.includes('edit-activity')) { this.editMode = true; }
		if (this.editMode) {
			this.route.params.subscribe(params => {
				this.activityKey = params['actKey'];
			});
			this.activitySub = this.activitiesObs.mergeMap(activities => {
				return activities.filter(activity => activity['$key'] === this.activityKey);
			}).first().subscribe(keyActivity => this.activity = keyActivity);
		} else {
			this.activity = new Activity();
		}
		this.createForm(this.activity);
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

	ngOnDestroy() {
		if (this.userSub) {
			this.userSub.unsubscribe();
		}
		if (this.activitySub) {
			this.activitySub.unsubscribe();
		}
		if (this.geoSub) {
			this.geoSub.unsubscribe();
		}
		if (this.categorySub) {
			this.categorySub.unsubscribe();
		}
	}

	addTag() {
		const tag = this.activityForm.get('tags').value;
		if (tag && !this.activityForm.controls.tags.hasError('maxlength')) {
			if (this.enteredTags.indexOf(tag) < 0) {
				this.enteredTags.push(tag);
			}
			this.activityForm.get('tags').setValue('');
		} else {
			console.error('Tag is too long!');
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
			activity.geoloc = this.dialogResult ? this.dialogResult : this.geoloc ? this.geoloc : null;
			activity.created_uid = this.user.userId;
			activity.createdOn = firebase.database.ServerValue.TIMESTAMP;
		}


		// Call save/update Activity
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
		activity.category = formValue.category; // FIXME: get category object WITH icon string as well?
		activity.description = formValue.description;
		activity.location = formValue.location;
		activity.date = formValue.date;
		activity.time = formValue.time;
		activity.organizer = this.user.displayName;
		activity.tags = [...this.enteredTags];
		return activity;
	}

	updateActivity(activity: Activity) {
		this.store.dispatch(this.activityActions.updateActivity(this.activityKey, activity));
	}

	saveActivity(activity: Activity) {
		this.store.dispatch(this.activityActions.addActivity(activity));
	}

	createForm(activity: Activity) {
		this.activityForm = this.fb.group({
			title: [activity.title, Validators.compose([Validators.required, Validators.maxLength(90)])],
			subtitle: [activity.subtitle, Validators.maxLength(90)],
			category: [activity.category, Validators.required],
			location: [activity.location, Validators.compose([Validators.required, Validators.maxLength(90)])],
			description: [activity.description, Validators.compose([Validators.required, Validators.maxLength(1000)])],
			time: activity.time,
			date: [activity.date,  Validators.compose([Validators.required, validateOldDate])],
			tags: ['', Validators.maxLength(40)]
		});

		// Refill tags and category when getting activity from previous instance (editing)
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
