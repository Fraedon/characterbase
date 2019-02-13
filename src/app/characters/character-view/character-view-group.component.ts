import { Component, Input, OnChanges, OnInit } from "@angular/core";

import { CharacterGroup, CharacterGuideGroup } from "../characters.model";

@Component({
    selector: "cb-character-view-group",
    templateUrl: "./character-view-group.component.html",
    styleUrls: ["./character-view-group.component.scss"],
})
export class CharacterViewGroupComponent implements OnChanges, OnInit {
    @Input() public canViewHidden = false;
    @Input() public characterGroup: CharacterGroup;
    public collapsed = false;
    @Input() public guideGroup: CharacterGuideGroup;
    public hidden = false;

    public getCharacterField(name: string) {
        return this.characterGroup.fields[name];
    }

    public getCharacterFields() {
        return Object.values(this.characterGroup.fields);
    }

    public getEntryText() {
        if (this.getCharacterFields().length > 1) {
            return `+${this.getCharacterFields().length} entries`;
        } else if (this.getCharacterFields().length === 1) {
            return "+1 entry";
        } else {
            return "No entries";
        }
    }

    public ngOnChanges() {
        this.collapsed = false;
    }

    public ngOnInit() {
        this.resetHidden();
    }

    public toggleCollapse() {
        this.collapsed = !this.collapsed;
    }

    private resetHidden() {
        if (this.characterGroup) {
            this.hidden = this.characterGroup.hidden;
        }
    }
}
