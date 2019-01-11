import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";

import { UniverseService } from "../core/universe.service";

import { MetaUniverse, Universe } from "./universe.model";

@Injectable({
    providedIn: "root",
})
export class UniverseResolverService implements Resolve<Observable<MetaUniverse>> {
    constructor(private universeService: UniverseService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<MetaUniverse>> {
        const id = route.params["universeId"];
        return of(this.universeService.getUniverse(id));
    }
}
