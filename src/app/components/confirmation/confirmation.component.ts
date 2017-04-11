import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
	selector: 'act-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
	param: any;

	constructor(public dialogRef: MdDialogRef<any>) {}

	ngOnInit() {
	}

}
