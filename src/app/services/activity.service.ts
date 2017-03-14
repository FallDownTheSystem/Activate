import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { ActivityActions } from '../store/actions/activity.actions';
import { Activity } from '../model/activity';
import { User } from '../model/user';

@Injectable()
export class ActivityService {

	constructor(private af: AngularFire,
							private store: Store<AppStore>,
							private activityActions: ActivityActions) { }

	getActivities(): Observable<Activity[]> {
		return this.af.database.list('/activities');
	}

	getUserActivities(user: User): Observable<Activity[]> {
	return this.af.database.list('/users/' + user.userId + '/activities')
							.map((act_ids: any[]) => {
								let activities: Activity[] = [];
								act_ids.forEach(aid => {
									this.af.database.object('/activities/' + aid['$value'] + '/' + aid['$key']).take(1)
									.subscribe(a => {
										console.log(a);
										activities.push(a);
									});
								});
								return activities;
						});
	}

	saveActivity(activity: Activity) {
		this.af.database.list('/activities').push(activity).then(
			(ret) => { // success
				if (ret.key) {
					this.af.database.object('/users/' + activity.created_uid + '/activities').update({[ret.key]: 'saved'});
				}
				this.store.dispatch(this.activityActions.addActivitySuccess());
			},
			(error: Error) => { // error
				console.error(error);
			}
		);
	}
}
