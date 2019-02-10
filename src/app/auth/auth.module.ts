import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

import { LoginFormComponent } from "./login/login-form.component";
import { LoginPageComponent } from "./login/login-page.component";
import { SettingsPageComponent } from "./settings/settings-page.component";
import { SignupFormComponent } from "./signup/signup-form.component";
import { SignupPageComponent } from "./signup/signup-page.component";

@NgModule({
    declarations: [
        SignupPageComponent,
        SignupFormComponent,
        LoginPageComponent,
        LoginFormComponent,
        SettingsPageComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, SharedModule, RouterModule],
})
export class AuthModule {}
