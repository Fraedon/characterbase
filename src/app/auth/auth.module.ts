import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { AuthRoutingModule } from "./auth-routing.module";
import { SignupPageComponent } from "./signup/signup-page.component";
import { SignupFormComponent } from "./signup/signup-form.component";
import { LoginPageComponent } from "./login/login-page.component";
import { LoginFormComponent } from "./login/login-form.component";

@NgModule({
    declarations: [
        SignupPageComponent,
        SignupFormComponent,
        LoginPageComponent,
        LoginFormComponent,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        AngularFireAuthModule,
    ]
})
export class AuthModule {}
