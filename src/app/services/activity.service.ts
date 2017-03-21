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
				return (this.category === '' || activity.category.category === this.category) &&
								(this.geoloc === null || activity.geoloc === undefined || this.distance === 0 || this.geoloc.distance(activity.geoloc) < this.distance) &&
								(this.search === '' ||
									activity.description.toLowerCase().includes(this.search.toLowerCase()) ||
									activity.location.toLowerCase().includes(this.search.toLowerCase()) ||
									activity.organizer.toLowerCase().includes(this.search.toLowerCase()) ||
									activity.subtitle.toLowerCase().includes(this.search.toLowerCase()) ||
									(activity.tags && activity.tags.reduce((acc, value) => acc || value.toLowerCase().includes(this.search.toLowerCase()), false)) ||
									activity.title.toLowerCase().includes(this.search.toLowerCase()));
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

		getActivity(key: String): Observable<Activity> {
		return this.af.database.list('/activities').map(activities => {
			return activities.filter((activity) => {
				return activity.$key === key;
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

	deleteActivity(key: string) {
		this.af.database.list('/activities').remove(key).then(
			(ret) => { // success
				this.store.dispatch(this.activityActions.deleteActivitySuccess());
			},
			(error: Error) => { // error
				console.error(error);
			}
		);
	}

	updateActivity(actKey: string, activity: Activity) {
		this.af.database.list('/activities').update(actKey, activity).then(
			(ret) => { // success
				this.store.dispatch(this.activityActions.updateActivitySuccess());
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
