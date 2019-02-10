import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";

import { UserCredentials } from "../shared/user.model";

@Component({
    selector: "cb-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent {
    @Output() public login = new EventEmitter<UserCredentials>();

    public loginForm = new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", Validators.required),
    });
    @Input() public status: FormStatus;

    public constructor() {}

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.loginForm.valid) {
            return SubmitButtonState.Allowed;
        } else {
            return SubmitButtonState.Disabled;
        }
    }

    public onLogin() {
        this.login.emit(this.loginForm.value);
    }
}
