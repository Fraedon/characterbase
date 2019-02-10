import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import "rxjs/add/operator/do";
import "rxjs/add/operator/mergeMap";
import { map, tap } from "rxjs/operators";

import { AuthService } from "../core/auth.service";

@Injectable({
    providedIn: "root",
})
export class UniverseGuard implements CanActivate {
    public constructor(public authService: AuthService, public router: Router) {}

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = next.params["universeId"];
        return this.authService.getCollaborations().pipe(
            map((data) =>
                data.reduce((acc, ref) => {
                    return acc || ref.id === id;
                }, false),
            ),
            tap((valid) => {
                if (!valid) {
                    this.router.navigate([""]);
                }
            }),
        );
    }
}
