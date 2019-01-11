import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import "rxjs/add/operator/do";
import "rxjs/add/operator/mergeMap";

import { UserService } from "../core/user.service";

import { Universe } from "./universe.model";

@Injectable({
    providedIn: "root",
})
export class UniverseGuard implements CanActivate {
    public constructor(public userService: UserService, public firestore: AngularFirestore, public router: Router) {}

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const id = next.params.universeId;
        return this.userService.user
            .first()
            .mergeMap((user) =>
                this.firestore
                    .doc(`/universes/${id}`)
                    .get()
                    .map((d) => {
                        const universe = d.data() as Universe;
                        if (!universe) {
                            return false;
                        }
                        return universe.collaborators.includes(user.email) || universe.owner.id === user.uid;
                    })
            )
            .do((valid) => {
                if (!valid) {
                    this.router.navigate([""]);
                }
            });
        return true;
    }
}
