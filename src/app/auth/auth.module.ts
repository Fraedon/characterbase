import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

import { AuthLandingComponent } from "./auth-landing/auth-landing.component";
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
        AuthLandingComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, SharedModule, AngularFireAuthModule, RouterModule],
})
export class AuthModule {}
