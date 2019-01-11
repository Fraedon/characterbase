import { Component, HostBinding, Input } from "@angular/core";

import { MetaCharacter } from "../character-resolver.service";
import { CharactersQuery } from "../character-toolbar/character-toolbar.component";
import { CharacterFieldValue, CharacterSort } from "../characters.model";

import { CharacterListMode } from "./character-list.component";

@Component({
    selector: "cb-character-list-item, [cb-character-list-item]",
    templateUrl: "./character-list-item.component.html",
    styleUrls: ["./character-list-item.component.scss"],
})
export class CharacterListItemComponent {
    @Input() public caption: { field: string; value: CharacterFieldValue };
    @Input() public character: MetaCharacter;
    public CharacterSort = CharacterSort;
    @HostBinding("class") public classes = "list-group-item list-group-item-action character-list-item";
    @Input() public mode: CharacterListMode;
    @Input() public sort: CharactersQuery;
}
