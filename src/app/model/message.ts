import { User } from './user';
import * as firebase from 'firebase';

export class Message {
	name: string;
	ownerId: string;
	message: string;
	timestamp?: any;
	edited?: any;

	constructor(name: string, ownerId: string, message: string, timestamp?: any) {
		this.name = name;
		this.ownerId = ownerId;
		this.message = message;
		this.timestamp = firebase.database.ServerValue.TIMESTAMP;
	}
}
