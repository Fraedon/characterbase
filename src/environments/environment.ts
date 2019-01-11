// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    firebase: {
        apiKey: "AIzaSyDFtjyOmAl9PG-mEjDaJ1CzTQ2eaL-0xOg",
        authDomain: "characterbase-tk.firebaseapp.com",
        databaseURL: "https://characterbase-tk.firebaseio.com",
        messagingSenderId: "183109382015",
        projectId: "characterbase-tk",
        storageBucket: "characterbase-tk.appspot.com",
    },
    auth0: {
        clientID: "KpJ03cy5EnXlnaNESX0bysdU9CyGQ1tt",
        domain: "characterbase.auth0.com",
        responseType: "token id_token",
        redirectUri: "localhost:4200/login",
        scope: "openid",
    },
    production: false,
    characterQueryLimit: 15,
    version: "v0.3.2",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
