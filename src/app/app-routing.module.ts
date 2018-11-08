import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SignupPageComponent } from "./auth/signup/signup-page.component";
import { LoginPageComponent } from "./auth/login/login-page.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    { path: "signup", component: SignupPageComponent },
    { path: "login", component: LoginPageComponent },
    { path: "", canActivate: [AuthGuard], loadChildren: "./universes/universes.module#UniversesModule" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
