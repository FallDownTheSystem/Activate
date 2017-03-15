import { GeolocationService } from './geolocation.service';
import { FilterService } from './filter.service';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { ActivityActions } from '../store/actions/activity.actions';
import { Activity, Coords } from '../model/activity';
import { User } from '../model/user';

@Injectable()
export class ActivityService implements OnDestroy {

	category = '';
	search = '';
	distance = 50;
	geoloc: Coords = null;
	sub: any;

	constructor(private af: AngularFire,
							private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private filterService: FilterService,
							private geolocService: GeolocationService) {

		this.sub = geolocService.getLocation({enableHighAccuracy: false, timeout: 5000,	maximumAge: 60000}).subscribe(geoloc => {
			this.geoloc = new Coords(geoloc.coords.latitude, geoloc.coords.longitude, geoloc.coords.accuracy);
		});

		this.filterService.category.subscribe(category => {
			this.category = category;
		});
		this.filterService.search.subscribe(search => {
			this.search = search;
		});
		this.filterService.distance.subscribe(distance => {
			this.distance = distance;
		});
	}

// Credit for filtering logic Cas
	getActivities(): Observable<Activity[]> {
		return this.af.database.list('/activities').map(activities => {
			return activities.filter((activity) => {
				return (this.category === '' || activity.category === this.category) &&
								(this.geoloc === null || this.geoloc.distance(activity.geoloc) < this.distance) &&
								(this.search === '' ||
									activity.description.includes(this.search) ||
									activity.location.includes(this.search) ||
									activity.organizer.includes(this.search) ||
									activity.subtitle.includes(this.search) ||
									(activity.tags && activity.tags.reduce((acc, value) => acc || value.includes(this.search), false)) ||
									activity.title.includes(this.search));
			});
		});
	}

//	,{
//		query: {
//			limitToLast: 2,
//		}
//	}

	getUserActivities(user: User): Observable<Activity[]> {
		return this.af.database.list('/activities').map(activities => {
			return activities.filter((activity) => {
				return activity.created_uid === user.userId;
			});
		});
	}

	saveActivity(activity: Activity) {
		this.af.database.list('/activities').push(activity).then(
			(ret) => { // success
				this.store.dispatch(this.activityActions.addActivitySuccess());
			},
			(error: Error) => { // error
				console.error(error);
			}
		);
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
