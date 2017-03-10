import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CategoryService, Category } from '../services/category.service';
import { ActivityService, Activity } from '../services/activity.service';
import { Router } from '@angular/router';

@Component({
	selector: 'act-new-activity',
	templateUrl: './new-activity.component.html',
	styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit, OnDestroy {
	categories: Category[];
	subcription: any;

	form: FormGroup;

	selectedValue;

	constructor(private fb: FormBuilder,
							private router: Router,
							private categoryService: CategoryService,
							private activityService: ActivityService) {
	}

		onSubmit() {
			console.log('model-based form submitted');
		}
		cancel() {
			console.log("cancel new activity");
		}

	ngOnInit() {
		this.subcription = this.categoryService.getCategories().subscribe(categories => this.categories = categories);
	}

	ngOnDestroy() {
		if (this.subcription) {
			this.subcription.unsubscribe();
		}
	}

