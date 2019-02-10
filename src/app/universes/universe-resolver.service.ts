import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { UniverseService } from "../core/universe.service";

import { UniverseStateService } from "./shared/universe-state.service";
import { MetaUniverse, Universe } from "./shared/universe.model";

@Injectable({
    providedIn: "root",
})
export class UniverseResolverService implements Resolve<Observable<Universe>> {
    constructor(private universeService: UniverseService, private universeStateService: UniverseStateService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Universe> {
        const id = route.params["universeId"];
        return this.universeService.getUniverse(id).pipe(
            tap((u) => {
                this.universeStateService.addUniverses(u);
            }),
        );
    }
}
