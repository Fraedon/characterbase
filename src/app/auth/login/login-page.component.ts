import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

import { User } from "../models/auth.model";

@Component({
    selector: "cb-login-page",
    templateUrl: "./login-page.component.html",
})
export class LoginPageComponent {
    public loading = false;
    public error = null;

    public constructor(public auth: AngularFireAuth, public router: Router) { }

    public async onSubmit(data: User) {
        this.error = null;
        this.loading = true;
        console.log(data);
        try {
            await this.auth.auth.signInWithEmailAndPassword(data.emailAddress, data.password);
            this.router.navigate([""]);
        } catch (err) {
            console.log(err);
            this.error = err;
        } finally {
            this.loading = false;
        }
    }
}
