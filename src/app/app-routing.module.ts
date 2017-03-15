import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessFormsComponent } from './components/access-forms/access-forms.component';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';
import { AccountComponent } from './components/account/account.component';
import { NewActivityComponent } from './components/new-activity/new-activity.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'access',  component: AccessFormsComponent },
	{ path: 'account',  component: AccountComponent, canActivate: [AuthGuardService] },
	{ path: 'home',  component: ActivityCardComponent },
	{ path: 'new-activity',  component: NewActivityComponent, canActivate: [AuthGuardService] },
	{ path: 'admin',
		component: AdminComponent,
		data: { roles: ['admin'] },
		canActivate: [AuthGuardService],
		canActivateChild: [AuthGuardService],
	}
];
@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
