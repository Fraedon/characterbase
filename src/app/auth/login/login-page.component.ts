import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/auth.service";
import { UserService } from "src/app/core/user.service";
import { FormStatus } from "src/app/shared/form-status.model";

import { UserCredentials } from "../shared/auth.model";

@Component({
    selector: "cb-login-page",
    templateUrl: "./login-page.component.html",
})
export class LoginPageComponent {
    public status: FormStatus = { error: undefined, loading: false };

    public constructor(private authService: AuthService, private router: Router) {}

    public async onSubmit(data: UserCredentials) {
        this.status = { error: undefined, loading: true };
        try {
            // await this.userService.signIn(data);
            await this.authService.login(data.emailAddress, data.password);
            await this.router.navigate([""]);
        } catch (err) {
            this.status.error = err;
        } finally {
            this.status.loading = false;
        }
    }
}
