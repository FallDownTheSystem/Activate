import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import { AppStore } from '../app-store';
import { Activity } from '../../services/activity.service';
import { ActivityActions } from '../actions/activity.actions';
import { ActivityService } from '../../services/activity.service';

@Injectable()
export class ActivityEffects {
	constructor (
		private actions$: Actions,
		private activityActions: ActivityActions,
		private svc: ActivityService
	) {

	}

	@Effect()
	loadActivities$ = this.actions$
			.ofType(ActivityActions.LOAD_ACTIVITIES)
			.switchMap(() => this.svc.getActivities())
			.map((activities: Activity[]) => this.activityActions.loadActivitiesSuccess(activities));

	@Effect()
	addActivity$ = this.actions$
			.ofType(ActivityActions.ADD_ACTIVITY)
			.switchMap((action) => this.svc.saveActivity(action.payload))
			.map((activity: Activity) => this.activityActions.addActivitySuccess(activity));
}


