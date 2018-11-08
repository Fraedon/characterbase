import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from "@angular/router";

import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(public auth: AngularFireAuth, public router: Router) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.user.pipe(
            map((user) => !!user),
            tap(loggedIn => {
                if (!loggedIn) {
                    this.router.navigate(["login"]);
                }
            }),
        );
    }
}
