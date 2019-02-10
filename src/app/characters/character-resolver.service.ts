import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";

import { CharacterService } from "../core/character.service";

import { Character } from "./characters.model";
import { CharacterStateService } from "./shared/character-state.service";

export interface MetaCharacter {
    data: Character;
    snap: DocumentSnapshot<Character>;
}

@Injectable({
    providedIn: "root",
})
export class CharacterResolverService implements Resolve<Observable<Observable<Character>>> {
    public constructor(
        private characterService: CharacterService,
        private characterStateService: CharacterStateService,
        private router: Router,
    ) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { characterId } = route.params;
        const { universeId } = route.parent.parent.params;
        if (this.characterStateService.getCharacter(characterId)) {
            return of(of(this.characterStateService.getCharacter(characterId)));
        } else {
            return this.characterService.getCharacter(universeId, characterId).pipe(
                tap((c) => this.characterStateService.addCharacters(c)),
                switchMap(() => of(of(this.characterStateService.getCharacter(characterId)))),
                catchError((err) => {
                    this.router.navigate(["/u", universeId]);
                    return of(null);
                }),
            );
        }
    }
}
