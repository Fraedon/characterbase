import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";

import { Character } from "./characters.model";

export interface MetaCharacter {
    data: Character;
    snap: DocumentSnapshot<Character>;
}

@Injectable({
    providedIn: "root",
})
export class CharacterResolverService implements Resolve<Observable<MetaCharacter>> {
    public constructor(public firestore: AngularFirestore) {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<MetaCharacter>> {
        const characterId = route.params.characterId;
        return of(
            this.firestore
                .doc<Character>(`characters/${characterId}`)
                .snapshotChanges()
                .map((p) => ({ data: p.payload.data() as Character, snap: p.payload }))
        );
    }
}
