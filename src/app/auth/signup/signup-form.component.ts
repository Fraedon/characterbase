import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormStatus } from "src/app/shared/form-status.model";
import { SubmitButtonState } from "src/app/shared/form/shared/submit-button-state.enum";

import { NewUserCredentials } from "../shared/user.model";

@Component({
    selector: "cb-signup-form",
    templateUrl: "./signup-form.component.html",
    styleUrls: ["./signup-form.component.scss"],
})
export class SignupFormComponent {
    @Output() public registered = new EventEmitter<NewUserCredentials>();
    public signupForm = new FormGroup({
        displayName: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });
    @Input() public status: FormStatus;

    public constructor() {}

    public getSubmitState() {
        if (this.status.loading) {
            return SubmitButtonState.Loading;
        } else if (this.signupForm.valid) {
            return SubmitButtonState.Allowed;
        } else {
            return SubmitButtonState.Disabled;
        }
    }

    public onSubmit() {
        const user = this.signupForm.value as NewUserCredentials;
        this.registered.emit(user);
    }
}
