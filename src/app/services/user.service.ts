import { Favorite } from '../model/favorite';
import { UserActions } from '../store/actions/user.actions';
import { TemplatesUsePublicRule } from 'codelyzer';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseApp, AngularFireDatabase } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import '../rxjs-extensions';
import * as firebase from 'firebase';

import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { ActivityActions } from '../store/actions/activity.actions';
import { Activity, Coords } from '../model/activity';
import { User } from '../model/user';

@Injectable()
export class UserService implements OnDestroy {

	user: User;
	sub: any;

	constructor(private af: AngularFire,
							private store: Store<AppStore>,
							private userActions: UserActions) {
		store.select(s => s.user).subscribe(user => this.user = user);
	}

	getFavorites(): Observable<Favorite[]> {
		return this.af.database.list('/users/' + this.user.userId + '/favorites');
	}

	saveFavorite(activityID: string) {
		const fav = new Favorite();
		fav.activityID = activityID;
		this.af.database.list('/users/' + this.user.userId + '/favorites').push(fav).then(
			(ret) => { // success
				this.store.dispatch(this.userActions.addFavoriteSuccess());
			},
			(error: Error) => { // error
				console.error(error);
			}
		);
	}

	deleteFavorite(activityID: string) {
		this.af.database.list('/users/' + this.user.userId + '/favorites').remove(activityID).then(
			(ret) => { // success
				this.store.dispatch(this.userActions.deleteFavoriteSuccess());
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
