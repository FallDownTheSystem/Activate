import { Observable } from 'rxjs/Observable';
import '../../rxjs-extensions';
import { Action } from '@ngrx/store';
import { MessageActions } from '../actions/message.actions';
import { Message } from '../../model/message';

export const messages = (state: any = [], action: Action): Message[] => {
	switch (action.type) {
		case MessageActions.LOAD_MESSAGES_SUCCESS: {
			return action.payload;
		}
		default:
			return state;
	}
};

export const messageStatus = (state: any = 'NONE', action: Action): string => {
	switch (action.type) {
		case MessageActions.ADD_MESSAGE:
			return 'IN PROGRESS';
		case MessageActions.ADD_MESSAGE_SUCCESS:
			return 'Message successfully added';
		case MessageActions.DELETE_MESSAGE:
			return 'IN PROGRESS';
		case MessageActions.DELETE_MESSAGE_SUCCESS:
			return 'Message successfully deleted';
		case MessageActions.UPDATE_MESSAGE:
			return 'IN PROGRESS';
		case MessageActions.UPDATE_MESSAGE_SUCCESS:
			return 'Message successfully updated';
		default:
			return state;
	}
};