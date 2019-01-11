import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/core/user.service";
import { FormStatus } from "src/app/shared/form-status.model";

import { NewUserCredentials } from "../shared/auth.model";

@Component({
    selector: "cb-signup-page",
    templateUrl: "./signup-page.component.html",
})
export class SignupPageComponent {
    public status: FormStatus = { error: undefined, loading: false };

    public constructor(private userService: UserService, private router: Router) {}

    public async onRegistered(data: NewUserCredentials) {
        this.status = { error: undefined, loading: true };
        try {
            await this.userService.createUserAndSignIn(data);
            await this.router.navigateByUrl("/");
        } catch (err) {
            this.status.error = err;
        } finally {
            this.status.loading = false;
        }
    }
}
