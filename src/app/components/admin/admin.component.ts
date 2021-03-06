import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../store/app-store';
import { User } from '../../model/user';

@Component({
	selector: 'act-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnDestroy {
	user: User;
	sub: any;
	constructor(private store: Store<AppStore>, private router: Router) {
		this.sub = store.select(s => s.user).subscribe(user => {
			if (!user || !user.roles['admin']) {
				this.router.navigate(['/home']);
			}
			this.user = user;
		});
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
