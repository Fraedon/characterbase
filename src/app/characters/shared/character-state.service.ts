import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Character, CharacterReference } from "../characters.model";

@Injectable({
    providedIn: "root",
})
export class CharacterStateService {
    private characters = new BehaviorSubject<Character[]>([]);
    private references = new BehaviorSubject<CharacterReference[]>([]);

    public addCharacters(...characters: Character[]) {
        this.characters.next([...this.characters.value, ...characters]);
    }

    public addCharactersWithReferences(...characters: Character[]) {
        const refs = [];
        characters.forEach((c) => {
            refs.push(this.convertToReference(c));
        });
        this.addCharacters(...characters);
        this.addReferences(...refs);
    }

    public addReferences(...references: CharacterReference[]) {
        this.references.next([...this.references.value, ...references]);
    }

    public clearCharacters() {
        this.characters.next([]);
    }

    public clearCharactersAndReferences() {
        this.clearCharacters();
        this.clearReferences();
    }

    public clearReferences() {
        this.references.next([]);
    }

    public getCharacter(id: string) {
        return this.characters.value.find((c) => c.id === id);
    }

    public getCharacters() {
        return this.characters.asObservable();
    }

    public getReferences() {
        return this.references.asObservable();
    }

    public removeCharacter(id: string) {
        const characters = this.characters.value.filter((c) => c.id !== id);
        const references = this.references.value.filter((r) => r.id !== id);
        this.characters.next(characters);
        this.references.next(references);
    }

    public setCharacter(id: string, data: Character) {
        const characters = this.characters.value.map((c) => {
            if (c.id === id) {
                c = data;
                this.setReference(id, this.convertToReference(data));
            }
            return c;
        });
        this.characters.next(characters);
    }

    public setReference(id: string, data: CharacterReference) {
        const references = this.references.value.map((r) => {
            if (r.id === id) {
                r = data;
            }
            return r;
        });
        this.references.next(references);
    }

    private convertToReference(character: Character): CharacterReference {
        return {
            id: character.id,
            name: character.name,
            tag: character.tag,
            ownerId: character.owner.id,
            avatarUrl: character.images["avatar"] ? character.images["avatar"] : null,
            createdAt: character.createdAt,
            updatedAt: character.updatedAt,
            hidden: character.meta.hidden,
            nameHidden: character.meta.nameHidden,
            parsedName: character.meta.name,
        };
    }
}
