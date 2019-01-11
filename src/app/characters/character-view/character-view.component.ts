import { Component, Input } from "@angular/core";
import { DynamicSizeType } from "src/app/shared/dynamic-size/dynamic-size.component";
import { Character, CharacterFieldType, CharacterGuideGroup, ProgressBarColor } from "../characters.model";

@Component({
    selector: "cb-character-view",
    templateUrl: "./character-view.component.html",
    styleUrls: ["./character-view.component.scss"],
})
export class CharacterViewComponent {
    @Input() character: Character;
    @Input() guide: CharacterGuideGroup[];

    public CharacterFieldType = CharacterFieldType;
    public DynamicSizeType = DynamicSizeType;

    public constructor() {}

    public entries(object: Object) {
        return Object.entries(object);
    }

    public getGroupByName(name: string) {
        return this.guide.find((g) => g.name === name);
    }

    public getFieldByName(groupName: string, fieldName: string) {
        return this.getGroupByName(groupName).fields.find((f) => f.name === fieldName);
    }

    public getImageByKey(key: string) {
        return this.character.images[key];
    }

    public convertProgressColor(color: string) {
        switch (color) {
            case ProgressBarColor.Blue:
                return "primary";
            case ProgressBarColor.Dark:
                return "dark";
            case ProgressBarColor.Gray:
                return "secondary";
            case ProgressBarColor.Green:
                return "success";
            case ProgressBarColor.Red:
                return "danger";
            case ProgressBarColor.Teal:
                return "info";
            case ProgressBarColor.Yellow:
                return "warning";
        }
    }
}
