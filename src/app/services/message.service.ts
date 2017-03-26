import { MessageActions } from '../store/actions/message.actions';
import { Message } from '../model/message';
import { Filter } from '../model/filter';
import { Category } from '../model/category';
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
export class MessageService implements OnDestroy {

	sub: any;

	constructor(private af: AngularFire,
							private store: Store<AppStore>,
							private messageActions: MessageActions) {
	}

	getMessages(): Observable<Message[]> {
		return this.af.database.list('/messages/');
	}

	saveMessage(context: string, message: Message) {
		message.timestamp = firebase.database.ServerValue.TIMESTAMP;

		this.af.database.list('/messages/' + context).push(message).then(
			(ret) => { // success
				this.store.dispatch(this.messageActions.addMessageSuccess());
			},
			(error: Error) => { // error
				console.error(error);
			}
		);
	}

	updateMessage(key: string, context: string, message: Message) {
		message.edited = firebase.database.ServerValue.TIMESTAMP;

		this.af.database.list('/messages/' + context).update(key, message).then(
			(ret) => { // success
				this.store.dispatch(this.messageActions.updateMessageSuccess());
			},
			(error: Error) => { // error
				console.error(error);
			}
		);
	}

	deleteMessage(key: string, context: string, message: Message) {
		message.name = 'Deleted';
		message.message = 'Deleted';
		message.edited = firebase.database.ServerValue.TIMESTAMP;

		this.af.database.list('/messages/' + context).update(key, message).then(
			(ret) => { // success
				this.store.dispatch(this.messageActions.deleteMessageSuccess());
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
