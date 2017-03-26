import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { AppStore } from '../app-store';
import { Message } from '../../model/message';
import { MessageActions } from '../actions/message.actions';
import { MessageService } from '../../services/message.service';

@Injectable()
export class MessageEffects {
	constructor (
		private actions$: Actions,
		private messageActions: MessageActions,
		private svc: MessageService,
		private store: Store<AppStore>) {

	}

	@Effect()
	loadMessages$ = this.actions$
			.ofType(MessageActions.LOAD_MESSAGES)
			.switchMap(() => this.svc.getMessages())
			.map((messages: Message[]) => this.messageActions.loadMessagesSuccess(messages));

	@Effect()
	deleteMessage$ = this.actions$
			.ofType(MessageActions.DELETE_MESSAGE)
			.do((action) => this.svc.deleteMessage(action.payload.key, action.payload.context, action.payload.message))
			.filter(() => false);

	@Effect()
	addMessage$ = this.actions$
			.ofType(MessageActions.ADD_MESSAGE)
			.do((action) => this.svc.saveMessage(action.payload.context, action.payload.message))
			.filter(() => false);

	@Effect()
	updateMessage$ = this.actions$
			.ofType(MessageActions.UPDATE_MESSAGE)
			.do((action) => this.svc.updateMessage(action.payload.key, action.payload.context, action.payload.message))
			.filter(() => false);
}


