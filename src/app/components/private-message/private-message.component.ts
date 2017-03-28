import { User } from '../../model/user';
import { Message } from '../../model/message';
import { Coords } from '../../model/activity';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
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
	pmForm: FormGroup;

	constructor(private store: Store<AppStore>,
							private messageActions: MessageActions,
							public dialogRef: MdDialogRef<any>,
							public snackBar: MdSnackBar,
							private fb: FormBuilder) {
			this.userSub = this.store.select(s => s.user).subscribe(user => this.user = user);
	}

	ngOnInit() {
		this.pmForm = this.fb.group({
			msg: ['', Validators.compose([Validators.required, Validators.maxLength(300)])]
			}
		);

		if (!this.userIdParam) {
			this.dialogRef.close();
		}
	}

	onSubmit() {
		this.message = new Message(this.user.displayName, this.user.userId, this.pmForm.get('msg').value);
		this.saveMessage(this.message);
		this.pmForm.reset();
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
