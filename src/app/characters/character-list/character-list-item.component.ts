import { Component, HostBinding, Input, OnChanges, OnInit } from "@angular/core";

import { CharacterFieldValue, CharacterReference, CharacterSort } from "../characters.model";

@Component({
    selector: "cb-character-list-item, [cb-character-list-item]",
    templateUrl: "./character-list-item.component.html",
    styleUrls: ["./character-list-item.component.scss"],
})
export class CharacterListItemComponent implements OnInit, OnChanges {
    public avatarUrl: string;
    @Input() public caption: { field: string; value: CharacterFieldValue };
    @Input() public character: CharacterReference;
    public CharacterSort = CharacterSort;
    @HostBinding("class") public classes: string;
    @Input() public last: boolean;
    @Input() public showAvatar: boolean;

    public ngOnChanges() {
        this.reloadAvatar();
    }

    public ngOnInit() {
        this.classes = `list-group-item list-group-item-action ${this.last ? "border-bottom" : ""} ${
            this.showAvatar ? "" : "no-avatar"
        }`;
        this.avatarUrl = this.character.avatarUrl ? this.character.avatarUrl : "assets/blank-avatar.png";
    }

    private reloadAvatar() {
        if (this.character.avatarUrl) {
            this.avatarUrl = this.character.avatarUrl + "#" + new Date().getTime();
        } else {
            this.avatarUrl = "assets/blank-avatar.png";
        }
    }
}
