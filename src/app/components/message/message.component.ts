import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Activity } from '../../model/activity';
import { Component, OnInit, OnDestroy, Input, ViewContainerRef } from '@angular/core';
import { MessageActions } from '../../store/actions/message.actions';
import { User } from '../../model/user';
import { Router } from '@angular/router';
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
	editMode: boolean[];
	messageForm: FormGroup;

	@Input() context: any;
	@Input() ownerId: any;

	constructor(private store: Store<AppStore>,
							private messageActions: MessageActions,
							private router: Router,
							public dialog: MdDialog,
							public viewContainerRef: ViewContainerRef,
							private fb: FormBuilder) {
	}

	ngOnInit() {
		this.messageForm = this.fb.group({
			msg: ['', Validators.compose([Validators.required, Validators.maxLength(300)])]
			}
		);

		this.userSub = this.store.select(s => s.user).subscribe(user => this.user = user);
		this.store.dispatch(this.messageActions.loadMessages(this.context));

		this.messagesObs = this.store.select(s => s.messages);
		this.msgSub = this.messagesObs.subscribe(messages => this.messages = messages);
		this.editMode = new Array(this.messages.length).fill(false);
	}

	onSubmit() {
		this.message = new Message(this.user.displayName, this.user.userId, this.messageForm.get('msg').value);
		this.saveMessage(this.message);
		this.messageForm.reset();
	}

	saveMessage(message: Message) {
		this.store.dispatch(this.messageActions.addMessage(message, this.context));
		this.editMode.push(false);
	}

	updateMessage(message: Message, i) {
		this.store.dispatch(this.messageActions.updateMessage(message['$key'], this.context, message));
		this.editMode[i] = !this.editMode[i];
	}

	deleteMessage(message: Message, i) {

			const config = new MdDialogConfig();
			config.viewContainerRef = this.viewContainerRef;
			this.dialogRef = this.dialog.open(ConfirmationComponent, config);
			this.dialogRef.componentInstance.param = 'Message';

			this.dialogRef.afterClosed().subscribe(result => {
				// console.log('result', result);
				this.dialogResult = result;

				if (this.dialogResult === true) {
						this.store.dispatch(this.messageActions.deleteMessage(message['$key'], this.context));
						this.editMode.splice(i, 1);
				}
			});

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

	disableOnAccount() {
		// Just for demoday
		return this.router.url.includes('account') === true ? false : true;
	}
}
