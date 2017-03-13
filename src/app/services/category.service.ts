import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class CategoryService {

	constructor(private af: AngularFire) { }

	getCategories(): Observable<Category[]> {
		return this.af.database.list('/categories');
	}
}

export class Category {
	category: string;
}
