import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessFormsComponent } from './access-forms/access-forms.component';
import { ActivityCardComponent } from './activity-card/activity-card.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'access',  component: AccessFormsComponent },
  { path: 'home',  component: ActivityCardComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
