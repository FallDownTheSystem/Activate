import { PrivateMessageComponent } from '../private-message/private-message.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { Activity } from '../../model/activity';
import { Component, OnInit, OnDestroy, Input, ViewContainerRef } from '@angular/core';
import { MessageActions } from '../../store/actions/message.actions';
import { User } from '../../model/user';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Message } from '../../model/message';
import { AppStore } from '../../store/app-store';
import '../../rxjs-extensions';

@Component({
	selector: 'act-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnDestroy {
	messages: Message[];
	messagesObs: Observable<Message[]>;
	msgSub: any;
	message: Message;
	user: User;
	userSub: any;
	dialogRef: MdDialogRef<any>;
	dialogResult: any;

	@Input() context: any;

	constructor(private store: Store<AppStore>,
							private messageActions: MessageActions,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef) {
	}

	ngOnInit() {
		this.userSub = this.store.select(s => s.user).subscribe(user => this.user = user);
		this.store.dispatch(this.messageActions.loadMessages(this.context));

		this.messagesObs = this.store.select(s => s.messages);
		this.msgSub = this.messagesObs.subscribe(messages => this.messages = messages);
	}

	onSubmit(form: any, msgArea: any) {
		if (form.msg) {
			this.message = new Message(this.user.displayName, this.user.userId, form.msg);
			this.saveMessage(this.message);
			msgArea.value = '';
		}
	}

	saveMessage(message: Message) {
		this.store.dispatch(this.messageActions.addMessage(message, this.context));
	}

	updateMessage(message: Message) {
		this.store.dispatch(this.messageActions.updateMessage(message['$key'], this.context, message));
	}

	deleteMessage(message: Message) {
		this.store.dispatch(this.messageActions.deleteMessage(message['$key'], this.context));
	}

	openDialog(msg: Message) {
		const config = new MdDialogConfig();
		config.viewContainerRef = this.viewContainerRef;
		this.dialogRef = this.dialog.open(PrivateMessageComponent, config);
		this.dialogRef.componentInstance.userIdParam = msg.ownerId;
		this.dialogRef.componentInstance.usernameParam = msg.name;

		this.dialogRef.afterClosed().subscribe(result => {
			// console.log('result', result);
			this.dialogResult = result;
		});
	}

	ngOnDestroy() {
		if (this.msgSub) {
			this.msgSub.unsubscribe();
		}
		this.store.dispatch(this.messageActions.emptyMessages());
		if (this.userSub) {
			this.userSub.unsubscribe();
		}
	}
}
