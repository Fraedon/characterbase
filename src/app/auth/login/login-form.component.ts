import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormStatus } from "src/app/shared/form-status.model";

import { UserCredentials } from "../shared/auth.model";

@Component({
    selector: "cb-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent {
    public get canSubmit() {
        return this.loginForm.valid && !this.status.loading;
    }
    @Output() public login = new EventEmitter<UserCredentials>();

    public loginForm = new FormGroup({
        emailAddress: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", Validators.required),
    });
    @Input() public status: FormStatus;

    public constructor() {}

    public onLogin() {
        this.login.emit(this.loginForm.value);
    }
}
