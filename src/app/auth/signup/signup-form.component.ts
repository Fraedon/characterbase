import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormStatus } from "src/app/shared/form-status.model";

import { NewUserCredentials } from "../shared/auth.model";

@Component({
    selector: "cb-signup-form",
    templateUrl: "./signup-form.component.html",
    styleUrls: ["./signup-form.component.scss"],
})
export class SignupFormComponent {
    public get canSubmit() {
        return this.signupForm.valid && !this.status.loading;
    }
    @Output() public registered = new EventEmitter<NewUserCredentials>();
    public signupForm = new FormGroup({
        displayName: new FormControl("", [Validators.required]),
        emailAddress: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });
    @Input() public status: FormStatus;

    public constructor() {}

    public onSubmit() {
        const user = this.signupForm.value as NewUserCredentials;
        this.registered.emit(user);
    }
}
