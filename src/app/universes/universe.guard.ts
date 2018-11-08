import { Injectable } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/do";
import { Universe } from "./universe.model";

@Injectable({
    providedIn: "root",
})
export class UniverseGuard implements CanActivate {
    public constructor(
        public auth: AngularFireAuth,
        public firestore: AngularFirestore,
        public router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const id = next.params.universeId;
        return this.auth.user.first().mergeMap((user) =>
            this.firestore
                .doc(`/universes/${id}`)
                .get()
                .map((d) => {
                    const universe = d.data() as Universe;
                    if (!universe) { return false; }
                    return universe.collaborators.includes(user.email) || universe.owner === user.uid;
                }),
        ).do((valid) => { if (!valid) { this.router.navigate([""]); }});
        // console.log(id);
        return true;
    }
}
