import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

@Injectable()
export class ActivityService {

	private _serviceUrl = 'http://localhost:3000/activities';  // URL to web api

	constructor(private http: Http) { }

	getActivities(): Observable<Activity[]> {
		let url = this._serviceUrl;
		return this.http.get(url).map(res => res.json());
	}

	saveActivity(activity: Activity): Observable<Activity> {
		let url = this._serviceUrl;
		return this.http.post(url, activity)
										.map(res => res.json());
	}
}

export class Activity {
	id: number;
	username: string;
	title: string;
	subtitle: string;
	category: string;
	description: string;
	location: string;
	gpsloc: string;
	date: string;
	time: string;
	createdOn: string;
	organizer: string;
	contact: string;
	tags: string[];
}
