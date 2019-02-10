import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output } from "@angular/core";

import { Character } from "../characters.model";

@Component({
    selector: "cb-character-view-toolbar",
    templateUrl: "./character-view-toolbar.component.html",
    styleUrls: ["./character-view-toolbar.component.scss"],
})
export class CharacterViewToolbarComponent implements OnChanges, OnInit {
    public avatarUrl: string;
    @Input() public canEdit = false;
    @Input() public character: Character;
    @Output() public deleted = new EventEmitter<null>();
    @Input() public showAvatar: boolean;
    @HostBinding("class") private classes = "btn-toolbar justify-content-between align-items-center";

    public ngOnChanges() {
        this.reloadAvatar();
    }

    public ngOnInit() {
        this.avatarUrl =
            this.character.images && this.character.images["avatar"]
                ? this.character.images["avatar"]
                : "assets/blank-avatar.png";
    }

    private reloadAvatar() {
        if (this.character.images && this.character.images["avatar"]) {
            this.avatarUrl = this.character.images["avatar"] + "#" + new Date().getTime();
        } else {
            this.avatarUrl = "assets/blank-avatar.png";
        }
    }
}
