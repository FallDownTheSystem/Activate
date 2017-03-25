import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app.component';
import { RegistrationComponent } from './components/access-forms/registration/registration.component';
import { LoginComponent } from './components/access-forms/login/login.component';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';
import { AccessFormsComponent } from './components/access-forms/access-forms.component';
import { AccountComponent } from './components/account/account.component';
import { FilterComponent } from './components/filter/filter.component';
import { NewActivityComponent } from './components/new-activity/new-activity.component';
import { AdminComponent } from './components/admin/admin.component';
import { MessageComponent } from './components/activity-card/message/message.component';

import { ActivityService } from './services/activity.service';
import { CategoryService } from './services/category.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { GeolocationService } from './services/geolocation.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { default as reducer } from './store/app-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';

import { CategoryActions } from './store/actions/category.actions';
import { CategoryEffects } from './store/effects/category.effects';
import { ActivityActions } from './store/actions/activity.actions';
import { ActivityEffects } from './store/effects/activity.effects';
import { UserActions } from './store/actions/user.actions';
import { UserEffects } from './store/effects/user.effects';
import { UIStateActions } from './store/actions/ui-state.action';

import { CONFIG } from '../environments/environment';


export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;

@NgModule({
	declarations: [
		AppComponent,
		RegistrationComponent,
		LoginComponent,
		ActivityCardComponent,
		AccessFormsComponent,
		AccountComponent,
		FilterComponent,
		NewActivityComponent,
		AdminComponent,
		MessageComponent
	],
	entryComponents: [
		// LoginComponent
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
		EffectsModule.run(UserEffects),
		EffectsModule.run(CategoryEffects),
		EffectsModule.run(ActivityEffects),
		StoreDevtoolsModule.instrumentOnlyWithExtension({
			maxAge: 20
		})
	],
	providers: [
		ActivityService, CategoryService, AuthenticationService, AuthGuardService, GeolocationService,
		CategoryActions, ActivityActions, UserActions, UIStateActions
	],
	bootstrap: [AppComponent]

})
export class AppModule { }
