import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";

import { CharacterService } from "../core/character.service";
import { Universe } from "../universes/shared/universe.model";

import { Character } from "./characters.model";

@Injectable({
    providedIn: "root",
})
export class CharacterUniverseResolverService implements Resolve<Observable<Universe>> {
    public constructor(private characterService: CharacterService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Universe> {
        return route.parent.parent.data["universe"];
    }
}
