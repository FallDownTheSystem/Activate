import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';

import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { ActivityActions } from '../store/actions/activity.actions';
import { Activity } from '../model/activity';

@Injectable()
export class ActivityService {

	constructor(private af: AngularFire,
							private store: Store<AppStore>,
							private activityActions: ActivityActions) { }

	getActivities(): Observable<Activity[]> {
		return this.af.database.list('/activities');
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
}
