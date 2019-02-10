import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DynamicSizeType } from "src/app/shared/dynamic-size/dynamic-size.component";
import { Universe } from "src/app/universes/shared/universe.model";

import {
    Character,
    CharacterField,
    CharacterFieldType,
    CharacterGuide,
    CharacterGuideGroup,
    CharacterImages,
    ProgressBarColor,
} from "../characters.model";

@Component({
    selector: "cb-character-view",
    templateUrl: "./character-view.component.html",
    styleUrls: ["./character-view.component.scss"],
})
export class CharacterViewComponent {
    @Input() public canEdit = false;
    @Input() public character: Character;
    public CharacterFieldType = CharacterFieldType;
    @Output() public deleted = new EventEmitter<null>();
    public DynamicSizeType = DynamicSizeType;
    @Input() public guide: CharacterGuide;
    @Input() public images: CharacterImages;
    @Input() public universe: Universe;

    public constructor() {}

    public getCanView() {
        return this.canEdit ? true : this.character.meta.hidden ? false : true;
    }

    public getCharacterGroup(name: string) {
        return this.character.fields.groups[name];
    }

    public getFieldClass(field: CharacterField) {
        return `field-${field.type}`;
    }

    public getFieldFromCharacter(groupName: string, fieldName: string) {
        if (this.character.fields.groups[groupName]) {
            if (this.character.fields.groups[groupName].fields[fieldName]) {
                return this.character.fields.groups[groupName].fields[fieldName];
            }
            return undefined;
        }
        return undefined;
    }

    public getFieldFromGuide(groupName: string, fieldName: string) {
        const group = this.guide.groups.find((g) => g.name === groupName);
        if (!group) {
            return undefined;
        }
        const field = group.fields.find((f) => f.name === fieldName);
        return field ? field : undefined;
    }

    public getGuideGroups() {
        return this.guide.groups;
    }

    public getProgressColor(color: ProgressBarColor) {
        switch (color) {
            case ProgressBarColor.Red:
                return "danger";
            case ProgressBarColor.Yellow:
                return "warning";
            case ProgressBarColor.Green:
                return "success";
            case ProgressBarColor.Teal:
                return "info";
            case ProgressBarColor.Gray:
                return "secondary";
            case ProgressBarColor.Dark:
                return "dark";
            default:
                return "primary";
        }
    }
}
