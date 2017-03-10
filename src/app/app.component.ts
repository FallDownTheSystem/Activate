import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'act-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Activate!';
  user = 'User';
  isLoggedIn = false;

	constructor(private router: Router) {}

	login() {
		this.isLoggedIn = true;
		this.router.navigate(['']);
	}
}
