import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AuthenticationService } from './services/authentication.service';
import { NewActivityComponent } from './new-activity/new-activity.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CategoryActions } from './store/actions/category.actions';
import { CategoryEffects } from './store/effects/category.effects';

import { ActivityActions } from './store/actions/activity.actions';
import { ActivityEffects } from './store/effects/activity.effects';

import { UserActions } from './store/actions/user.actions';

import { default as reducer } from './store/app-store';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
	apiKey: 'AIzaSyC3q3P_SGyBabEIMIqcSkrD5eqi-wb7B60',
	authDomain: 'activate-2cb8a.firebaseapp.com',
	databaseURL: 'https://activate-2cb8a.firebaseio.com',
	storageBucket: 'activate-2cb8a.appspot.com',
	messagingSenderId: '1027933252042'
};

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
	entryComponents: [
		LoginComponent
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(firebaseConfig),
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		MaterialModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		StoreModule.provideStore(reducer),
		EffectsModule.run(CategoryEffects),
		EffectsModule.run(ActivityEffects),
		StoreDevtoolsModule.instrumentOnlyWithExtension({
			maxAge: 20
		})
	],
	providers: [
		ActivityService, CategoryService, AuthenticationService,
		CategoryActions, ActivityActions, UserActions
	],
	bootstrap: [AppComponent]

})
export class AppModule { }
