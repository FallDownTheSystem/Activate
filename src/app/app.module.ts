import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './access-forms/registration/registration.component';
import { LoginComponent } from './access-forms/login/login.component';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { AccessFormsComponent } from './access-forms/access-forms.component';
import { AccountComponent } from './account/account.component';
import { FilterComponent } from './filter/filter.component';
import { ActivityService } from './services/activity.service';

@NgModule({
	declarations: [
		AppComponent,
		RegistrationComponent,
		LoginComponent,
		ActivityCardComponent,
		AccessFormsComponent,
		AccountComponent,
		FilterComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		MaterialModule,
		AppRoutingModule
	],
	providers: [ActivityService],
	bootstrap: [AppComponent]

})
export class AppModule { }
