import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
import { CategoryService } from './services/category.service';
import { NewActivityComponent } from './new-activity/new-activity.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CategoryActions } from './store/actions/category.actions';
import { CategoryEffects } from './store/effects/category.effects';
import { default as reducer } from './store/app-store';


@NgModule({
	declarations: [
		AppComponent,
		RegistrationComponent,
		LoginComponent,
		ActivityCardComponent,
		AccessFormsComponent,
		AccountComponent,
		FilterComponent,
		NewActivityComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		MaterialModule,
		AppRoutingModule,
		StoreModule.provideStore(reducer),
		EffectsModule.run(CategoryEffects)
	],
	providers: [ActivityService, CategoryService, CategoryActions],
	bootstrap: [AppComponent]

})
export class AppModule { }
