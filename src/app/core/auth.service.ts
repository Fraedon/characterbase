import { Injectable } from "@angular/core";
import * as auth0 from "auth0-js";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private auth = new auth0.WebAuth(environment.auth0);

    constructor() {}

    public login(email: string, password: string) {
        return new Promise((resolve, reject) => {
            this.auth.login({ email, password }, (err) => {
                if (err) {
                    return reject(err.errorDescription);
                }
                resolve(true);
            });
        });
    }
}
