import { Injectable } from "@angular/core";
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";

import { Observable } from "rxjs";
import { Universe } from "./universe.model";

export interface UniverseResolve extends Universe {
    meta: {
        id: string;
    };
}

@Injectable({
    providedIn: "root",
})
export class UniverseResolverService implements Resolve<UniverseResolve> {
    constructor(public firestore: AngularFirestore) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UniverseResolve> {
        const id = route.params.universeId;
        return this.firestore.doc<Universe>(`/universes/${id}`).get().map((d) => ({ ...d.data() as Universe, meta: { id }}));
    }
}
