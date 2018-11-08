import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

import { User } from "../models/auth.model";

@Component({
    selector: "cb-signup-page",
    templateUrl: "./signup-page.component.html",
})
export class SignupPageComponent {
    public loading = false;
    public error = null;

    public constructor(public auth: AngularFireAuth) {}

    public async onRegistered(data: User) {
        this.error = null;
        this.loading = true;
        try {
            const userCreds = await this.auth.auth.createUserWithEmailAndPassword(
                data.emailAddress,
                data.password,
            );
            // TODO: Redirect user to main page
        } catch (err) {
            this.error = err;
        } finally {
            this.loading = false;
        }
    }
}
