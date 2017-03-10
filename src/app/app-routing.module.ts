import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessFormsComponent } from './access-forms/access-forms.component';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { AccountComponent } from './account/account.component';
import { NewActivityComponent } from './new-activity/new-activity.component';

const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'access',  component: AccessFormsComponent },
	{ path: 'account',  component: AccountComponent },
	{ path: 'home',  component: ActivityCardComponent },
	{ path: 'new-activity',  component: NewActivityComponent }
];
@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
