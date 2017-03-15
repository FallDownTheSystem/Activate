// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IConfig } from './iconfig';

export const environment = {
	production: false
};

export const CONFIG: IConfig = {
	'firebaseConfig' : {
		apiKey: 'AIzaSyC3q3P_SGyBabEIMIqcSkrD5eqi-wb7B60',
		authDomain: 'activate-2cb8a.firebaseapp.com',
		databaseURL: 'https://activate-2cb8a.firebaseio.com',
		storageBucket: 'activate-2cb8a.appspot.com',
		messagingSenderId: '1027933252042'
	}
};
