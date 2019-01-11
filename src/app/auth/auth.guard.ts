import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { CanLoad, Router } from "@angular/router";
import { Observable } from "rxjs";
import { first, map, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanLoad {
    constructor(public auth: AngularFireAuth, public router: Router) {}

    public canLoad(): Observable<boolean> | Promise<boolean> | boolean {
        return this.auth.user.pipe(
            first(),
            map((user) => !!user),
            tap((loggedIn) => {
                console.log(loggedIn);
                if (!loggedIn) {
                    this.router.navigate(["login"]);
                }
            })
        );
    }
}
