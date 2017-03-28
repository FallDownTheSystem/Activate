import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

export function validateOldDate(date: FormControl) {

	const formDate = new Date(date.value);
	const curDate = new Date();
	curDate.setDate(curDate.getDate() - 1);

	if (formDate >= curDate) {
		return null;
	} else {
		return { ValidateOldDate: {
			valid: false
		}};
	}
}

@Directive({
	selector: '[actOldActivity][ngModel]',
	providers: [
		{ provide: NG_VALIDATORS, useValue: validateOldDate, multi: true }
	]
})

export class OldActivityDirective {

	constructor() { }

}
