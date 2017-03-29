import { Favorite } from './favorite';
import { AuthProviders, FirebaseAuthState } from 'angularfire2';

export class User {
	userId: string;
	displayName: string;
	email: string;
	authState: FirebaseAuthState;
	roles: any[];
	favorites: Favorite[];

	constructor(authState: FirebaseAuthState) {
		if (authState) {
			this.authState = authState;
			this.userId = authState.uid;
			this.email = authState.auth.providerData[0].email;
			this.displayName = (authState.auth.displayName ? authState.auth.displayName : 'Account');
		}
	}
}
