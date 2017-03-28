import { User } from '../../model/user';
import { Message } from '../../model/message';
import { Coords } from '../../model/activity';
import { MdDialogRef, MdSnackBar, MdSnackBarRef } from '@angular/material';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MessageActions } from '../../store/actions/message.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppStore } from '../../store/app-store';
import '../../rxjs-extensions';

@Component({
	selector: 'act-private-message',
	templateUrl: './private-message.component.html',
	styleUrls: ['./private-message.component.scss']
})

export class PrivateMessageComponent implements OnDestroy {
	userIdParam: any;
	usernameParam: any;
	message: Message;
	user: User;
	userSub: any;
	snackbarRef: MdSnackBarRef<any>;

	constructor(private store: Store<AppStore>,
							private messageActions: MessageActions,
							public dialogRef: MdDialogRef<any>,
							public snackBar: MdSnackBar) {
			this.userSub = this.store.select(s => s.user).subscribe(user => this.user = user);
	}

	ngOnInit() {
		console.log(this.userIdParam);
		if (!this.userIdParam) {
			this.dialogRef.close();
		}
	}

	onSubmit(form: any, msgArea: any) {
		if (form.msg) {
			this.message = new Message(this.user.displayName, this.user.userId, form.msg);
			this.saveMessage(this.message);
			msgArea.value = '';
		}
	}

	saveMessage(message: Message) {
		this.store.dispatch(this.messageActions.addMessage(message, this.userIdParam));
		this.snackbarRef = this.snackBar.open('Private message sent.', 'OK', {duration: 1000});
		this.snackbarRef.afterDismissed().subscribe(() => {
			this.dialogRef.close();
		});
	}

	ngOnDestroy() {
		if (this.userSub) {
			this.userSub.unsubscribe();
		}
	}

}
