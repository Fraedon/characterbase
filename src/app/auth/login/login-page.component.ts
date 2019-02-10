import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { AuthService } from "src/app/core/auth.service";
import { FormStatus } from "src/app/shared/form-status.model";

import { UserCredentials } from "../shared/user.model";

@Component({
    selector: "cb-login-page",
    templateUrl: "./login-page.component.html",
})
export class LoginPageComponent implements OnInit {
    public status: FormStatus = { error: undefined, loading: false };

    public constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

    public ngOnInit() {
        this.route.data.pipe(first()).subscribe((data) => {
            console.log(data);
        });
    }

    public async onSubmit(data: UserCredentials) {
        this.status = { error: undefined, loading: true };
        this.authService.logIn(data.email, data.password).subscribe(
            async () => {
                await this.router.navigate([""]);
            },
            (err) => {
                this.status.loading = false;
                this.status.error = err;
            },
        );
    }
}
