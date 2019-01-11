import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";
import { LoginPageComponent } from "./auth/login/login-page.component";
import { SignupPageComponent } from "./auth/signup/signup-page.component";

const routes: Routes = [
    { component: LoginPageComponent, path: "login" },
    { component: SignupPageComponent, path: "signup" },
    { canLoad: [AuthGuard], loadChildren: "./universes/universes.module#UniversesModule", path: "" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
