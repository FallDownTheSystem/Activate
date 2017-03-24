import { Filter } from '../model/filter';
import { Category } from '../model/category';
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

	filter: Filter = new Filter;
	sub: any;

	constructor(private af: AngularFire,
							private store: Store<AppStore>,
							private activityActions: ActivityActions,
							private filterService: FilterService) {

		this.filterService.filter.subscribe(filter => {
			this.filter = filter;
		});
	}

// Credit for filtering logic to Cas
	getActivities(): Observable<Activity[]> {
		return this.af.database.list('/activities').map(activities => {
			return activities.filter((activity) => {
				return (this.filter.category == null || this.filter.category.category === '' || activity.category.category === this.filter.category.category) &&
								(activity.geoloc == null || this.filter.distance == null || this.filter.distance === 0 || this.filter.geoloc.distance(activity.geoloc) < this.filter.distance) &&
								(this.filter.search == null || this.filter.search === '' ||
									activity.description.toLowerCase().includes(this.filter.search.toLowerCase()) ||
									activity.location.toLowerCase().includes(this.filter.search.toLowerCase()) ||
									activity.organizer.toLowerCase().includes(this.filter.search.toLowerCase()) ||
									activity.subtitle.toLowerCase().includes(this.filter.search.toLowerCase()) ||
									(activity.tags && activity.tags.reduce((acc, value) => acc || value.toLowerCase().includes(this.filter.search.toLowerCase()), false)) ||
									activity.title.toLowerCase().includes(this.filter.search.toLowerCase()));
			});
		});
	}

// Example of how to add queries to database requests (2nd parameter)
//	,{
//		query: {
//			limitToLast: 2,
//		}
//	}

	// TODO: Combine with get activities and do filter at a local level
	/*
	getUserActivities(user: User): Observable<Activity[]> {
		return this.af.database.list('/activities').map(activities => {
			return activities.filter((activity) => {
				return activity.created_uid === user.userId;
			});
		});
	}
	*/

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
