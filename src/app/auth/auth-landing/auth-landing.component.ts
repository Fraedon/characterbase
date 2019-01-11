import { Component } from "@angular/core";
import { AuthService } from "src/app/core/auth.service";

@Component({
    selector: "cb-auth-landing",
    templateUrl: "./auth-landing.component.html",
    styleUrls: ["./auth-landing.component.scss"],
})
export class AuthLandingComponent {
    public constructor(private authService: AuthService) {}

    public login() {
        console.log(this.authService);
        this.authService.login();
    }
}
