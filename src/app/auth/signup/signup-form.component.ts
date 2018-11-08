import { Component, Output, EventEmitter, Input, OnChanges } from "@angular/core";

import { User } from "../models/auth.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: "cb-signup-form",
    templateUrl: "./signup-form.component.html",
    styleUrls: ["./signup-form.component.scss"],
})
export class SignupFormComponent implements OnChanges {
    @Input() loading: boolean;
    @Input() error: string;
    @Output() registered = new EventEmitter<User>();

    public signupForm = new FormGroup({
        emailAddress: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
    });

    public constructor() { }

    public ngOnChanges(changes) {
        if (changes["loading"]) {
            if (changes["loading"].currentValue) { this.signupForm.disable(); return; }
            this.signupForm.enable();
        }
    }

    public onSubmit() {
        const user = this.signupForm.value as User;
        this.registered.emit(user);
    }
}
