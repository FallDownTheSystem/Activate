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
}

export class Activity {
	id: number;
	username: string;
	title: string;
	subtitle: string;
	description: string;
	location: string;
	gpsloc: string;
	time: string;
	organizer: string;
	categories: number[];
	tags: string[];
	favorites: number;
}
