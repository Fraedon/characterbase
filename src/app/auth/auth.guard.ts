import { Injectable } from "@angular/core";
import { CanLoad, Router } from "@angular/router";
import { Observable } from "rxjs";
import { first, map, tap } from "rxjs/operators";

import { AuthService } from "../core/auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanLoad {
    constructor(public authService: AuthService, public router: Router) {}

    public canLoad(): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.getUser().pipe(
            first(),
            map((user) => !!user),
            tap((loggedIn) => {
                if (!loggedIn) {
                    this.router.navigate(["login"]);
                }
            }),
        );
    }
}
