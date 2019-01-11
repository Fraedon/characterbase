import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";

import { MetaCharacter } from "../characters/character-resolver.service";
import { CharacterService } from "../core/character.service";

@Injectable({
    providedIn: "root",
})
export class UniverseCharactersResolverService implements Resolve<Observable<MetaCharacter[]>> {
    constructor(private characterService: CharacterService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<MetaCharacter[]>> {
        const universeId = route.params["universeId"];
        return of(this.characterService.getCharactersFromUniverse(universeId));
    }
}
