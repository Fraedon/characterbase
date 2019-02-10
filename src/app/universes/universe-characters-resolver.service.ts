import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";

import { CharacterReference } from "../characters/characters.model";
import { CharacterStateService } from "../characters/shared/character-state.service";
import { CharacterQueryResult, CharacterService } from "../core/character.service";

@Injectable({
    providedIn: "root",
})
export class UniverseCharactersResolverService implements Resolve<Observable<CharacterQueryResult>> {
    constructor(private characterService: CharacterService, private characterStateService: CharacterStateService) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const universeId = route.params["universeId"];
        this.characterStateService.clearCharactersAndReferences();
        return this.characterService
            .getCharacters(universeId)
            .pipe(tap((r) => this.characterStateService.addReferences(...r.characters)));
    }
}
