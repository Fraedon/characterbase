import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { finalize, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { FormStatus } from "src/app/shared/form-status.model";

import { NewUserCredentials } from "../shared/user.model";

@Component({
    selector: "cb-signup-page",
    templateUrl: "./signup-page.component.html",
})
export class SignupPageComponent {
    public status: FormStatus = { error: undefined, loading: false };

    public constructor(private authService: AuthService, private router: Router) {}

    public async onRegistered(data: NewUserCredentials) {
        this.status = { error: undefined, loading: true };
        this.authService
            .register(data.displayName, data.email, data.password)
            .pipe(
                switchMap(() => this.authService.logIn(data.email, data.password)),
                finalize(() => (this.status.loading = false)),
            )
            .subscribe(
                () => {
                    this.router.navigate([""]);
                },
                (err) => {
                    this.status.error = err;
                },
            );
    }
}
