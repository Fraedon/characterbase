import { Component, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

import { environment } from "../../../environments/environment";
import { MetaCharacter } from "../character-resolver.service";
import { CharactersQuery } from "../character-toolbar/character-toolbar.component";

export enum CharacterListMode {
    List = 0,
}

@Component({
    selector: "cb-character-list",
    templateUrl: "./character-list.component.html",
    styleUrls: ["./character-list.component.scss"],
})
export class CharacterListComponent {
    public CharacterListMode = CharacterListMode;
    @Input() public characters: MetaCharacter[];
    public divisor = environment.characterQueryLimit;
    @Input() public mode: CharacterListMode;
    @Input() public query: CharactersQuery;
    @Input() public total: number;

    public get sortedCharacters() {
        if (this.query && this.query.filter) {
            const field = this.query.filter.split(".");
            return this.characters.concat().sort((a, b) => {
                const aGroup = a.data.fieldGroups.find((g) => g.name === field[0]);
                const bGroup = b.data.fieldGroups.find((g) => g.name === field[0]);
                if (!aGroup || !aGroup.fields[field[1]]) {
                    return 1;
                }
                if (!bGroup || !bGroup.fields[field[1]]) {
                    return -1;
                }
                if (aGroup.fields[field[1]].value < bGroup.fields[field[1]].value) {
                    return -1;
                }
                if (aGroup.fields[field[1]].value > bGroup.fields[field[1]].value) {
                    return 1;
                }
                return 0;
            });
        } else {
            return this.characters;
        }
    }

    public constructor(private sanitizer: DomSanitizer) {}

    public genListBackgroundCSS(url?: string) {
        return this.sanitizer.bypassSecurityTrustStyle(
            `linear-gradient(to right, rgba(255, 255, 255, 1.0) 25%, rgba(255, 255, 255, 0.8))${
                url ? `, url(${url}) right` : ""
            }`
        );
    }

    public getListCaption(character: MetaCharacter) {
        if (this.query && this.query.filter) {
            const field = this.query.filter.split(".");
            const group = character.data.fieldGroups.find((g) => g.name === field[0]);
            if (group && group.fields[field[1]]) {
                return { field: field[1], value: group.fields[field[1]].value };
            }
        }
    }

    public get canMovePrevious() {
        return this.query.page.count > 0;
    }

    public get canMoveNext() {
        return this.query.page.count + this.characters.length < this.total;
    }
}
