import { Component, Input, EventEmitter, Output, OnChanges } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { User } from "../models/auth.model";

@Component({
    selector: "cb-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnChanges {
    @Input() error: string;
    @Input() loading: boolean;
    @Output() login = new EventEmitter<User>();

    public loginForm = new FormGroup({
        emailAddress: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", Validators.required),
    });

    public constructor() { }

    public ngOnChanges(changes) {
        if (changes["loading"]) {
            if (changes["loading"].currentValue) { this.loginForm.disable(); return; }
            this.loginForm.enable();
        }
    }

    public onLogin() {
        this.login.emit(this.loginForm.value);
    }
}
