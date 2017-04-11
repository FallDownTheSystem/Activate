import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from './components/app.component';
import { RegistrationComponent } from './components/access-forms/registration/registration.component';
import { LoginComponent } from './components/access-forms/login/login.component';
import { ActivityCardComponent } from './components/activity-card/activity-card.component';
import { AccessFormsComponent } from './components/access-forms/access-forms.component';
import { AccountComponent } from './components/account/account.component';
import { FilterComponent } from './components/filter/filter.component';
import { NewActivityComponent } from './components/new-activity/new-activity.component';
import { AdminComponent } from './components/admin/admin.component';
import { MessageComponent } from './components/message/message.component';
import { GmapComponent } from './components/gmap/gmap.component';
import { PrivateMessageComponent } from './components/private-message/private-message.component';
import { AboutComponent } from './components/about/about.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

import { OldActivityDirective } from './directives/old-activity.directive';

import { ActivityService } from './services/activity.service';
import { CategoryService } from './services/category.service';
import { MessageService } from './services/message.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuardService } from './services/auth-guard.service';
import { GeolocationService } from './services/geolocation.service';
import { UserService } from './services/user.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { default as reducer } from './store/app-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';

import { CategoryActions } from './store/actions/category.actions';
import { CategoryEffects } from './store/effects/category.effects';
import { ActivityActions } from './store/actions/activity.actions';
import { ActivityEffects } from './store/effects/activity.effects';
import { MessageActions } from './store/actions/message.actions';
import { MessageEffects } from './store/effects/message.effects';
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
		MessageComponent,
		GmapComponent,
		PrivateMessageComponent,
		OldActivityDirective,
		AboutComponent,
		ConfirmationComponent
	],
	entryComponents: [
		GmapComponent, PrivateMessageComponent, AboutComponent, ConfirmationComponent
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
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyAxYzauvta2DZ_3b-0zViUm9fRGDqFXyJw',
			libraries: ["places"]
		}),
		StoreModule.provideStore(reducer),
		EffectsModule.run(UserEffects),
		EffectsModule.run(CategoryEffects),
		EffectsModule.run(ActivityEffects),
		EffectsModule.run(MessageEffects),
		StoreDevtoolsModule.instrumentOnlyWithExtension({
			maxAge: 20
		})
	],
	providers: [
		ActivityService, CategoryService, AuthenticationService, AuthGuardService, GeolocationService, MessageService, UserService,
		CategoryActions, ActivityActions, UserActions, UIStateActions, MessageActions
	],
	bootstrap: [AppComponent]

})
export class AppModule { }
