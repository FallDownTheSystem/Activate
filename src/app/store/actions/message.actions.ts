import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Message } from '../../model/message';

@Injectable()
export class MessageActions {

	static LOAD_MESSAGES = 'LOAD_MESSAGES';
	loadMessages(): Action {
		return {
			type: MessageActions.LOAD_MESSAGES
		};
	}

	static LOAD_MESSAGES_SUCCESS = 'LOAD_MESSAGES_SUCCESS';
	loadMessagesSuccess(messages: Message[]): Action {
		return {
			type: MessageActions.LOAD_MESSAGES_SUCCESS,
			payload: messages
		};
	}

	static ADD_MESSAGE = 'ADD_MESSAGE';
	addMessage(message: Message, context: string): Action {
		return {
			type: MessageActions.ADD_MESSAGE,
			payload: { message, context }
		};
	}

	static ADD_MESSAGE_SUCCESS = 'ADD_MESSAGE_SUCCESS';
	addMessageSuccess(): Action {
		return {
			type: MessageActions.ADD_MESSAGE_SUCCESS,
			payload: null
		};
	}

	static UPDATE_MESSAGE = 'UPDATE_MESSAGE';
	updateMessage(key: string, context: string, message: Message): Action {
		return {
			type: MessageActions.UPDATE_MESSAGE,
			payload: { key, context, message }
		};
	}

	static UPDATE_MESSAGE_SUCCESS = 'UPDATE_MESSAGE_SUCCESS';
	updateMessageSuccess(): Action {
		return {
			type: MessageActions.UPDATE_MESSAGE_SUCCESS,
			payload: null
		};
	}

	static DELETE_MESSAGE = 'DELETE_MESSAGE';
	deleteMessage(key: string, context: string, message: Message): Action {
		return {
			type: MessageActions.DELETE_MESSAGE,
			payload: { key, context, message }
		};
	}

	static DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
	deleteMessageSuccess(): Action {
		return {
			type: MessageActions.DELETE_MESSAGE_SUCCESS,
			payload: null
		};
	}
}
